const express = require("express");
const router = express.Router();
const {
  addEquipment,
  getOwnerEquipment,
  getInventoryEquipment,
  getOwnerGyms,
  assignEquipmentToGym,
  updateEquipment,
  deleteEquipment,
  scheduleMaintenance,
  deleteMaintenance,
  updateMaintenanceStatus,
  getMaintenanceHistory,
  checkDueMaintenance,
  getPublicGymEquipment,
} = require("../../controller/Gym_Owner/equipmentController");
const requireAuth = require("../../middleware/requireAuth");

// Public: Get equipment for a specific gym (no auth)
router.get("/public/gym/:gymId", getPublicGymEquipment);

// Apply authentication middleware
router.use(requireAuth);

// Equipment CRUD routes
router.post("/", addEquipment);
router.get("/owner", getOwnerEquipment);
router.get("/inventory", getInventoryEquipment);
router.get("/owner-gyms", getOwnerGyms);
router.post("/assign", assignEquipmentToGym);
router.patch("/:id", updateEquipment);
router.delete("/:id", deleteEquipment);

// Maintenance routes
router.post("/:equipmentId/maintenance", scheduleMaintenance);
router.delete("/:equipmentId/maintenance/:maintenanceId", deleteMaintenance);
router.patch(
  "/:equipmentId/maintenance/:maintenanceId",
  updateMaintenanceStatus
);
router.get("/:equipmentId/maintenance", getMaintenanceHistory);
router.get("/maintenance/due", checkDueMaintenance);

module.exports = router;
