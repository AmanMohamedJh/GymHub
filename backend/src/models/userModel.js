const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validator = require("validator");
const bcrypt = require("bcrypt"); // Used to hash the password for more security

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "", //A dummy default picture is here before uploading image//Aman//
  },
  role: {
    type: String,
    enum: ["client", "gym_owner", "trainer"],
    required: true,
  },
});

//// Static signup method needs to be defined before exporting the model to ensure it is part of the schema(Not an AI generated comment)

userSchema.statics.signup = async function (
  name,
  email,
  phone,
  password,
  role
) {
  //Here im going to validate the inputs

  if (!name || !email || !phone || !password || !role) {
    throw Error("All field must be filled and selected");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid try again ");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not Strong Enough");
  }
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("This Email is already registered");
  }

  // Generate a salt and hash the password for secure storage

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt); // here the final password will be added with trash numbers with 10 characters

  // Create and save the new user with the hashed password(password with salt )

  const user = await this.create({ name, email, phone, password: hash, role });

  return user;
};

//// Static Login method

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("No account found with this email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
