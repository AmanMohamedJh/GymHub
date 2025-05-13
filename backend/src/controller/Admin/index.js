const getClientsController = require("./client/GetClientsController");
const updateClientProfileController = require("./client/UpdateClientProfileController");
const updateClientStatusController = require("./client/UpdateClientStatusController");
const deleteClientController = require("./client/DeleteClientController");
const getGyms = require("./gym/gymController");
const updateGymProfile = require("./gym/UpdateGymProfileController");
const updateGymStatus = require("./gym/UpdateGymStatusController");
const deleteGym = require("./gym/DeleteGymController");

module.exports = {
  getClientsController,
  updateClientProfileController,
  updateClientStatusController,
  deleteClientController,

  getGyms,
  updateGymProfile,
  updateGymStatus,
  deleteGym,
};
