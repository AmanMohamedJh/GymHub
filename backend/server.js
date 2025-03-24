require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

//import of user.js by naming it userRoutes
const userRoutes = require("./src/routes/user");
const subscriptionRoutes = require("./src/routes/Subscription/subscriptionRoutes");
const subscriptionController = require("./src/controller/Subscription/subscriptionController");

const app = express();
const PORT = process.env.PORT || 4070;

// Configure CORS before any routes
app.use(cors());

// Webhook endpoint must be before express.json() middleware
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  subscriptionController.handleWebhook
);

// Regular middleware for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/user", userRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to DB & in PORT : ", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
