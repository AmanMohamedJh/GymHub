const User = require("../../../models/userModel");
const ClientGymRegistration = require("../../../models/Gym_Owner/ClientGymRegistration");

/**
 * Controller to update a client's status (Active/Inactive)
 * Updates the status in the ClientGymRegistration model
 */
const updateClientStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate required field
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Validate status value
    if (status !== "active" && status !== "inactive") {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active' or 'inactive'",
      });
    }

    // Verify user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (user.role !== "client") {
      return res.status(400).json({
        success: false,
        message: "User is not a client",
      });
    }

    // Find and update the client's gym registration status
    const clientRegistration = await ClientGymRegistration.findOneAndUpdate(
      { clientId: id },
      { status: status.toLowerCase() },
      { new: true }
    );

    if (!clientRegistration) {
      return res.status(404).json({
        success: false,
        message: "Client registration not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Client status updated to ${status} successfully`,
      data: {
        clientId: id,
        status: clientRegistration.status,
      },
    });
  } catch (error) {
    console.error("Error updating client status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update client status",
      error: error.message,
    });
  }
};

module.exports = updateClientStatusController;
