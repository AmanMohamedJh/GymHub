const getClientsController = require("./client/GetClientsController");
const updateClientProfileController = require("./client/UpdateClientProfileController");
const updateClientStatusController = require("./client/UpdateClientStatusController");
const deleteClientController = require("./client/DeleteClientController");
const getGyms = require("./gym/gymController");
const updateGymProfile = require("./gym/UpdateGymProfileController");
const updateGymStatus = require("./gym/UpdateGymStatusController");
const deleteGym = require("./gym/DeleteGymController");
const getTrainersController = require("./trainer/GetTrainersController");

const updateTrainerStatusController = require("./trainer/UpdateTrainerStatusController");
const deleteTrainerController = require("./trainer/DeleteTrainerController");
const getUserProfileController = require("./user/GetUserProfileController");
const updateUserProfileController = require("./user/UpdateUserProfileController");
const { getStats } = require("./stats/statsController");
const {
  getContactMessages,
  deleteContactMessage,
  replyToContactMessage,
} = require("./contactus/index");
const {
  getAllSubscriptions,
  updateSubscriptionPrice,
  getSubscriptionPlans,
} = require("./subscription/index");

module.exports = {
  getClientsController,
  updateClientProfileController,
  updateClientStatusController,
  deleteClientController,

  getGyms,
  updateGymProfile,
  updateGymStatus,
  deleteGym,
  getTrainersController,
  updateTrainerStatusController,
  deleteTrainerController,
  getUserProfileController,
  updateUserProfileController,
  getStats,

  getContactMessages,
  deleteContactMessage,
  replyToContactMessage,

  // Subscription controllers
  getAllSubscriptions,
  updateSubscriptionPrice,
};
