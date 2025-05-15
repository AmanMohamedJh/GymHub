const Gym = require("../../models/Gym_Owner/Gym");
const Equipment = require("../../models/Gym_Owner/Equipment");
const GymReview = require("../../models/Gym_Owner/GymReview");
const mongoose = require("mongoose");

// Register a new gym
const registerGym = async (req, res) => {
  try {
    const {
      name,
      location,
      operatingHours,
      amenities,
      equipment,
      genderAccess,
      notes,
    } = req.body;

    // Parse the location data
    const parsedLocation = JSON.parse(location);

    // Get uploaded files
    const images = req.files["gymImages"]
      ? req.files["gymImages"].map((file) => file.path.replace(/\\/g, "/"))
      : [];
    const certificate = req.files["certificate"]
      ? req.files["certificate"][0].path.replace(/\\/g, "/")
      : null;

    // Parse equipment IDs if present
    let equipmentIds = [];
    if (equipment) {
      equipmentIds = JSON.parse(equipment);
    }

    // Create new gym
    const newGym = {
      name,
      location: parsedLocation,
      images,
      operatingHours: JSON.parse(operatingHours),
      amenities: JSON.parse(amenities),
      equipment: equipmentIds,
      certificate,
      genderAccess,
      notes,
      ownerId: req.user._id,
      status: "pending", // Explicitly set status
    };

    console.log("Creating gym with data:", newGym);

    const session = await mongoose.startSession();
    session.startTransaction();

    const gym = await Gym.create([newGym], { session });
    console.log("Created gym:", gym[0].toObject());

    // Update equipment documents to link them to this gym
    if (equipmentIds && equipmentIds.length > 0) {
      console.log("Updating equipment with gym details...");

      // Update each equipment individually to ensure all updates are applied
      const updatedEquipment = [];
      for (const equipmentId of equipmentIds) {
        try {
          const updateResult = await Equipment.findOneAndUpdate(
            {
              _id: equipmentId,
              inInventory: true, // Additional check to ensure it's still in inventory
            },
            {
              $set: {
                gymId: gym[0]._id,
                gymName: name,
                inInventory: false,
              },
            },
            {
              session,
              new: true, // Return the updated document
              runValidators: true, // Run model validations
            }
          );

          if (!updateResult) {
            throw new Error(
              `Equipment ${equipmentId} is not available in inventory`
            );
          }

          console.log(`Updated equipment ${equipmentId}:`, updateResult);
          updatedEquipment.push(updateResult);
        } catch (error) {
          console.error(`Error updating equipment ${equipmentId}:`, error);
          throw error; // Re-throw to trigger transaction rollback
        }
      }

      console.log("All updated equipment:", updatedEquipment);

      // Add equipment details to response
      const gymResponse = gym[0].toObject();
      gymResponse.equipment = updatedEquipment;

      await session.commitTransaction();
      res.status(201).json(gymResponse);
    } else {
      await session.commitTransaction();
      res.status(201).json(gym[0]);
    }
  } catch (error) {
    console.error("Error in registerGym:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all approved gyms only (for public browse)
const getAllGyms = async (req, res) => {
  try {
    const gyms = await Gym.find({ status: "approved" }).sort({ createdAt: -1 });
    // Attach average rating to each gym
    const gymsWithRatings = await Promise.all(
      gyms.map(async (gym) => {
        const reviews = await GymReview.find({ gymId: gym._id });
        const avgRating = reviews.length
          ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
          : 0;
        return { ...gym.toObject(), avgRating };
      })
    );
    res.status(200).json(gymsWithRatings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all gyms for a gym owner
const getOwnerGyms = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { ownerId: req.user._id };

    if (status) {
      query.status = status;
    }

    const gyms = await Gym.find(query).populate("equipment");
    res.status(200).json(gyms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get nearby gyms
const getNearbyGyms = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius in meters, default 5km

    const gyms = await Gym.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    }).populate("equipment");

    res.status(200).json(gyms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update gym details
const updateGym = async (req, res) => {
  const { id } = req.params;

  try {
    const gym = await Gym.findOne({ _id: id, ownerId: req.user._id });
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }

    // Handle file updates if present
    if (req.files) {
      if (req.files["gymImages"]) {
        const newImages = req.files["gymImages"].map((file) =>
          file.path.replace(/\\/g, "/")
        );
        gym.images = [...gym.images, ...newImages];
      }
      if (req.files["certificate"]) {
        gym.certificate = req.files["certificate"][0].path.replace(/\\/g, "/");
      }
    }

    // Update other fields
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      let dbKey = key;
      // Map frontend allowedGenders to backend genderAccess
      if (key === "allowedGenders") dbKey = "genderAccess";
      // Prevent location updates from PATCH
      if (dbKey === "location") return; // skip location
      if (
        dbKey === "operatingHours" ||
        dbKey === "amenities" ||
        dbKey === "equipment"
      ) {
        gym[dbKey] =
          typeof updates[key] === "string"
            ? JSON.parse(updates[key])
            : updates[key];
      } else {
        gym[dbKey] = updates[key];
      }
    });

    await gym.save();
    res.status(200).json(gym);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete gym
const deleteGym = async (req, res) => {
  const { id } = req.params;

  try {
    const gym = await Gym.findOneAndDelete({ _id: id, ownerId: req.user._id });
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }

    // Update equipment to remove gym association
    await Equipment.updateMany({ gymId: id }, { $unset: { gymId: "" } });

    res.status(200).json({ message: "Gym deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update gym status (for admin)
const updateGymStatus = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { status } = req.body;

    if (!["pending", "approved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }

    gym.status = status;
    await gym.save();

    res.status(200).json(gym);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get pending gyms (for admin)
const getPendingGyms = async (req, res) => {
  try {
    const gyms = await Gym.find({ status: "pending" });
    res.status(200).json(gyms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a gym by ID (for ManageGym page)
const getGymById = async (req, res) => {
  try {
    const gym = await Gym.findOne({
      _id: req.params.gymId,
      ownerId: req.user._id,
    }).populate("equipment");
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }
    res.status(200).json(gym);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Public gym details for advertising mainly used in the SeeGymDetails.jsx
const getPublicGymById = async (req, res) => {
  try {
    const gym = await Gym.findOne({
      _id: req.params.gymId,
      status: "approved",
    });
    if (!gym) {
      return res.status(404).json({ error: "Gym not found or not approved" });
    }
    // Optionally, remove sensitive fields here
    res.status(200).json(gym);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerGym,
  getOwnerGyms,
  getNearbyGyms,
  updateGym,
  deleteGym,
  updateGymStatus,
  getPendingGyms,
  getAllGyms,
  getGymById,
  getPublicGymById,
};
