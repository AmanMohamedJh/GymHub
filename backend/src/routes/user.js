const express = require("express");
const router = express.Router();

//controller functions
const { loginUser, signupUser } = require("../controller/userController");

//login Route

router.post("/login", loginUser);

//Signup Route
router.post("/signup", signupUser);

module.exports = router;
