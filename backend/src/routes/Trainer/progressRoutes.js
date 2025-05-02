const express = require("express");
const router = express.Router();
const { getProgress, addProgress, updateProgress, deleteProgress } = require("../../controller/Trainer/progressController");

router.get("/", getProgress);
router.post("/", addProgress);
router.put("/:id", updateProgress);
router.delete("/:id", deleteProgress);

module.exports = router;
