const User = require("../../../models/userModel");
const Client = require("../../../models/Client/clientModel");

/**
 * Controller to update a client's status (pending/approved/rejected)
 * Updates the status in the Client model
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
    if (
      status !== "pending" &&
      status !== "approved" &&
      status !== "rejected"
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'pending', 'approved', or 'rejected'",
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

    // Find and update the client's status
    const client = await Client.findOneAndUpdate(
      { userId: id },
      { status: status },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Client status updated to ${status} successfully`,
      data: {
        clientId: id,
        status: client.status,
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
