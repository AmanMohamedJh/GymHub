const getClientsController = require("./client/GetClientsController");
const updateClientProfileController = require("./client/UpdateClientProfileController");
const updateClientStatusController = require("./client/UpdateClientStatusController");
const deleteClientController = require("./client/DeleteClientController");

module.exports = {
  getClientsController,
  updateClientProfileController,
  updateClientStatusController,
  deleteClientController,
};
