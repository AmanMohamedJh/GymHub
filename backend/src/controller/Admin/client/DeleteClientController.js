const User = require("../../../models/userModel");
const Client = require("../../../models/Client/clientModel");
const ClientGymRegistration = require("../../../models/Gym_Owner/ClientGymRegistration");
const ClientTrainerSessions = require("../../../models/Client/ClientTrainerSessions");
const GymBooking = require("../../../models/Client/gymBookingDetails");
const Subscription = require("../../../models/Subscription/SubscriptionModel");

/**
 * Controller to delete a client and all associated data
 * This is a destructive operation and should be used with caution
 */
const deleteClientController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user and verify they exist and are a client
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

    // Use a database transaction to ensure all related data is deleted or none at all
    const session = await User.startSession();
    session.startTransaction();

    try {
      // Delete client profile
      await Client.findOneAndDelete({ userId: id }).session(session);

      // Delete gym registrations
      await ClientGymRegistration.deleteMany({ clientId: id }).session(session);

      // Delete trainer sessions
      await ClientTrainerSessions.deleteMany({ clientId: id }).session(session);

      // Delete gym bookings
      await GymBooking.deleteMany({ clientId: id }).session(session);

      // Delete subscriptions related to the client
      await Subscription.deleteMany({ userId: id }).session(session);

      // Finally, delete the user account
      await User.findByIdAndDelete(id).session(session);

      // Commit the transaction if all operations are successful
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Client and all associated data deleted successfully",
      });
    } catch (error) {
      // If any operation fails, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error deleting client:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: error.message,
    });
  }
};

module.exports = deleteClientController;
