const ClientGymRegistration = require("../../models/Gym_Owner/ClientGymRegistration");
const User = require("../../models/userModel");

// POST /api/gyms/:gymId/Clientregister
exports.registerClientToGym = async (req, res) => {
  try {
    console.log("[REGISTER] Incoming registration request:", {
      params: req.params,
      user: req.user,
      body: req.body,
    });
    const { gymId } = req.params;
    const clientId = req.user._id; // assuming auth middleware sets req.user
    // Fetch user for prefill
    const user = await User.findById(clientId);
    if (!user) {
      console.error("[REGISTER] User not found:", clientId);
      return res.status(404).json({ error: "User not found" });
    }

    const {
      phone,
      dob,
      age,
      gender,
      fitnessGoals,
      medical,
      fitnessLevel,
      startDate,
      promoCode,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
    } = req.body;

    const registration = new ClientGymRegistration({
      gymId,
      clientId,
      fullName: user.name,
      email: user.email,
      phone: phone || user.phone,
      dob,
      age,
      gender,
      fitnessGoals,
      medical,
      fitnessLevel,
      startDate,
      promoCode,
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relation: emergencyRelation,
      },
    });
    await registration.save();
    console.log("[REGISTER] Registration saved:", registration);
    res.status(201).json({ message: "Registration successful", registration });
  } catch (error) {
    console.error("[REGISTER] Registration error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/gymOwner/gyms/:gymId/client-status
exports.getClientGymStatus = async (req, res) => {
  try {
    const { gymId } = req.params;
    const clientId = req.user._id;
    const registration = await ClientGymRegistration.findOne({
      gymId,
      clientId,
    });
    if (!registration) {
      return res.status(200).json({ registered: false });
    }
    res.status(200).json({ registered: true, status: registration.status });
  } catch (error) {
    console.error("[STATUS] Error fetching client gym status:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/gyms/:gymId/Clientregistrations
exports.getGymClientRegistrations = async (req, res) => {
  try {
    const { gymId } = req.params;
    const registrations = await ClientGymRegistration.find({ gymId }).populate(
      "clientId",
      "fullName email"
    );
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/users/:userId/ClientGymRegistrations
exports.getUserClientRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;
    const registrations = await ClientGymRegistration.find({
      clientId: userId,
    }).populate("gymId", "name");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
