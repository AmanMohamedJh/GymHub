//import of Model
const User = require("../models/userModel");

//import of Json Web Token (JWT Authorizations)
const jwt = require("jsonwebtoken");

// Function to create a JWT token

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
};

//login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Create token including role
    const token = createToken(user._id, user.role);

    res.status(200).json({ email, role: user.role, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//signup user

const signupUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const user = await User.signup(name, email, phone, password, role);

    //create Token using JWT

    const token = createToken(user._id, user.role);

    res.status(200).json({ name, email, role, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };
