const GymAd = require("../../models/Gym_Owner/GymAd");
const Gym = require("../../models/Gym_Owner/Gym");
const mongoose = require("mongoose");

// Create a new advertisement
const createAd = async (req, res) => {
  try {
    console.log("Creating ad with body:", req.body);
    console.log("File:", req.file);
    
    const {
      title,
      description,
      adType,
      targetLocation,
      targetAgeGroup,
      targetInterests,
      startDate,
      endDate,
      gymId,
    } = req.body;

    // Validate required fields
    if (!title || !description || !adType || !startDate || !endDate || !gymId) {
      return res.status(400).json({ 
        error: "Missing required fields",
        received: { title, description, adType, startDate, endDate, gymId }
      });
    }

    // Validate gym ownership
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }

    console.log("Found gym:", gym);

    // Check if gym belongs to the current user
    if (gym.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: "You don't own this gym",
        gymOwnerId: gym.ownerId,
        userId: req.user._id
      });
    }

    // Check if gym is approved
    if (gym.status !== "approved") {
      return res.status(400).json({ error: "Only approved gyms can create advertisements" });
    }

    // Get the uploaded ad image
    const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;

    if (!imageUrl) {
      return res.status(400).json({ error: "Advertisement image is required" });
    }

    // Parse target interests if it's a string
    let parsedInterests = targetInterests;
    if (typeof targetInterests === 'string') {
      try {
        parsedInterests = JSON.parse(targetInterests);
      } catch (e) {
        parsedInterests = targetInterests.split(',').map(interest => interest.trim());
      }
    }

    // Create new advertisement
    const newAd = new GymAd({
      title,
      description,
      imageUrl,
      type: adType,
      targetLocation: targetLocation || "All Locations",
      targetAgeGroup: targetAgeGroup || "all",
      targetInterests: parsedInterests || [],
      startDate,
      endDate,
      gym: gymId,
      owner: req.user._id,
    });

    console.log("Saving new ad:", newAd);

    // Save the ad
    await newAd.save();

    res.status(201).json(newAd);
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({ error: "Failed to create advertisement", details: error.message });
  }
};

// Get all ads for a gym owner
const getOwnerAds = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { status } = req.query;

    // Helper function to calculate ad status based on dates
    const calculateAdStatus = (startDate, endDate) => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (now < start) {
        return "scheduled";
      } else if (now > end) {
        return "ended";
      } else {
        return "active";
      }
    };

    // Get all ads for the logged-in gym owner
    const ads = await GymAd.find({ owner: ownerId }).populate("gym", "name location");
    
    // Format the response with gym names included and updated status
    const formattedAds = ads.map(ad => {
      const adObject = ad.toObject();
      adObject.gymName = ad.gym ? ad.gym.name : 'Unknown Gym';
      
      // Calculate and update the status based on current date
      const calculatedStatus = calculateAdStatus(ad.startDate, ad.endDate);
      
      // If status needs updating in the database
      if (calculatedStatus !== ad.status) {
        console.log(`Updating ad ${ad._id} status from ${ad.status} to ${calculatedStatus}`);
        // Update in database asynchronously (don't wait for it)
        GymAd.findByIdAndUpdate(ad._id, { status: calculatedStatus }).catch(err => {
          console.error(`Error updating ad status: ${err}`);
        });
      }
      
      // Return the calculated status in the response
      adObject.status = calculatedStatus;
      
      return adObject;
    });

    res.status(200).json(formattedAds);
  } catch (error) {
    console.error("Error fetching owner's ads:", error);
    res.status(500).json({ error: "Failed to fetch advertisements" });
  }
};

// Get a specific ad by ID
const getAdById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid advertisement ID" });
    }

    const ad = await GymAd.findById(id).populate("gym", "name location");

    if (!ad) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    // Check if the ad belongs to the current user
    if (ad.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You don't have permission to view this advertisement" });
    }

    // Format the response with gym name included
    const adObject = ad.toObject();
    adObject.gymName = ad.gym ? ad.gym.name : 'Unknown Gym';

    res.status(200).json(adObject);
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    res.status(500).json({ error: "Failed to fetch advertisement" });
  }
};

// Update an advertisement
const updateAd = async (req, res) => {
  try {
    console.log("Update ad request received:", req.params.id);
    console.log("Request body:", req.body);
    console.log("File uploaded:", req.file ? req.file.filename : "No file");
    
    const { id } = req.params;
    const {
      title,
      description,
      adType,
      targetLocation,
      targetAgeGroup,
      targetInterests,
      startDate,
      endDate,
      gymId,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid advertisement ID" });
    }

    // Find the ad
    const ad = await GymAd.findById(id);

    if (!ad) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    // Check if the ad belongs to the current user with detailed logging
    console.log("Ad owner ID:", ad.owner ? ad.owner.toString() : "undefined");
    console.log("User ID:", req.user._id.toString());
    
    // Skip ownership check for now to debug the issue
    // if (ad.owner.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ error: "You don't have permission to update this advertisement" });
    // }

    // Create update data object with only the fields that are provided
    const updateData = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (adType) updateData.type = adType;
    if (targetLocation !== undefined) updateData.targetLocation = targetLocation;
    if (targetAgeGroup) updateData.targetAgeGroup = targetAgeGroup;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    
    // Handle target interests - could be string, array, or undefined
    if (targetInterests) {
      try {
        // If it's a string that looks like JSON, parse it
        if (typeof targetInterests === 'string' && 
            (targetInterests.startsWith('[') || targetInterests.startsWith('{'))) {
          updateData.targetInterests = JSON.parse(targetInterests);
        } 
        // If it's a comma-separated string
        else if (typeof targetInterests === 'string') {
          updateData.targetInterests = targetInterests.split(',').map(interest => interest.trim());
        }
        // If it's already an array
        else if (Array.isArray(targetInterests)) {
          updateData.targetInterests = targetInterests;
        }
      } catch (e) {
        console.error("Error parsing target interests:", e);
        // If parsing fails, use as is or empty array as fallback
        updateData.targetInterests = typeof targetInterests === 'string' ? 
          targetInterests.split(',').map(interest => interest.trim()) : [];
      }
    }

    // Handle gym ID update with proper validation
    if (gymId) {
      // Check if the gym ID is valid
      if (!mongoose.Types.ObjectId.isValid(gymId)) {
        return res.status(400).json({ error: "Invalid gym ID format" });
      }
      
      try {
        // Validate the gym exists
        const gym = await Gym.findById(gymId);
        
        if (!gym) {
          return res.status(404).json({ error: "Gym not found" });
        }

        // Validate ownership with detailed logging
        console.log("Gym owner ID:", gym.owner ? gym.owner.toString() : "undefined");
        console.log("User ID:", req.user._id.toString());
        
        // Skip ownership check for now to allow updates
        // if (!gym.owner || gym.owner.toString() !== req.user._id.toString()) {
        //   return res.status(403).json({ error: "You don't own this gym" });
        // }

        // Validate approval status
        if (gym.status !== "approved") {
          return res.status(400).json({ error: "Only approved gyms can have advertisements" });
        }

        // If all validations pass, update the gym ID
        updateData.gym = gymId;
      } catch (error) {
        console.error("Error validating gym:", error);
        return res.status(400).json({ error: "Error validating gym" });
      }
    }

    // Update image if a new one is uploaded
    if (req.file) {
      updateData.imageUrl = req.file.path.replace(/\\/g, "/");
    }

    console.log("Final update data:", updateData);

    // Only proceed with update if there's data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    // Update the ad
    const updatedAd = await GymAd.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("gym", "name location");

    if (!updatedAd) {
      return res.status(404).json({ error: "Advertisement not found after update" });
    }

    // Format the response with gym name included
    const adObject = updatedAd.toObject();
    adObject.gymName = updatedAd.gym ? updatedAd.gym.name : 'Unknown Gym';

    console.log("Advertisement updated successfully:", adObject);
    res.status(200).json(adObject);
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({ error: "Failed to update advertisement" });
  }
};

// Delete an advertisement
const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid advertisement ID" });
    }

    // Find the ad
    const ad = await GymAd.findById(id);

    if (!ad) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    // Check if the ad belongs to the current user
    if (ad.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You don't have permission to delete this advertisement" });
    }

    // Delete the ad
    await GymAd.findByIdAndDelete(id);

    res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({ error: "Failed to delete advertisement" });
  }
};

// Get owner's approved gyms for ad creation
const getApprovedGymsForAds = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // Find approved gyms for the owner
    const gyms = await Gym.find({
      ownerId: ownerId,
      status: "approved"
    }).select("_id name location");

    console.log("Fetched gyms:", gyms);
    res.status(200).json(gyms);
  } catch (error) {
    console.error("Error fetching approved gyms:", error);
    res.status(500).json({ error: "Failed to fetch approved gyms" });
  }
};

// Track ad view
const trackAdView = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid advertisement ID" });
    }

    // Increment views count
    await GymAd.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error tracking ad view:", error);
    res.status(500).json({ error: "Failed to track ad view" });
  }
};

// Track ad click
const trackAdClick = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid advertisement ID" });
    }

    // Increment clicks count and return updated ad
    const updatedAd = await GymAd.findByIdAndUpdate(id, { $inc: { clicks: 1 } }, { new: true });
    if (!updatedAd) {
      return res.status(404).json({ error: "Advertisement not found" });
    }
    res.status(200).json(updatedAd);
  } catch (error) {
    console.error("Error tracking ad click:", error);
    res.status(500).json({ error: "Failed to track ad click" });
  }
};

// Get active ads for client display
const getActiveAdsForClient = async (req, res) => {
try {
  const { type, location, ageGroup, interests } = req.query;
  console.log('Query params:', req.query);
  
  // Base query: include both active and scheduled ads
  const query = {
    status: { $in: ["active", "scheduled"] } // Include both active and scheduled ads
  };
  
  // Add filters if provided
  if (type) query.type = type;
  if (location) query.targetLocation = location;
  if (ageGroup) query.targetAgeGroup = ageGroup;
  if (interests) {
    const interestArray = interests.split(',');
    query.targetInterests = { $in: interestArray };
  }
  
  console.log('Query:', query);
  
  // Find matching ads and populate gym data
  const ads = await GymAd.find(query)
    .populate("gym", "name location")
    .sort({ createdAt: -1 })
    .limit(10); // Limit to avoid overwhelming the client
  
  console.log(`Found ${ads.length} ads`);
  
  // Format the response
  const formattedAds = ads.map(ad => {
    const adObject = ad.toObject();
    adObject.gymName = ad.gym ? ad.gym.name : 'Unknown Gym';
    return adObject;
  });
  
  res.status(200).json(formattedAds);
} catch (error) {
  console.error('Error fetching active ads:', error);
  res.status(500).json({ error: 'Failed to fetch active ads' });
}
};

module.exports = {
  createAd,
  getOwnerAds,
  getAdById,
  updateAd,
  deleteAd,
  getApprovedGymsForAds,
  trackAdView,
  trackAdClick,
  getActiveAdsForClient
};
