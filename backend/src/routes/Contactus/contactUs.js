const express = require("express");
const router = express.Router();

const { contactUsAdd, getSingleDetail, getAllDetails, deleteDetail, UpdateDetail } = require("../../controller/Contactus/contactUsController");

router.post("/contactUsAdd", contactUsAdd);
router.get("/getSingledetail/:id", getSingleDetail);
router.get("/getAllDetails", getAllDetails);
router.delete("/deleteDetail/:id", deleteDetail);
router.patch("/update/:id", UpdateDetail);

module.exports = router;
