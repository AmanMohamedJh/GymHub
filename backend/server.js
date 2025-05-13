require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// Import user and gym routes
const userRoutes = require("./src/routes/user");
const subscriptionRoutes = require("./src/routes/Subscription/subscriptionRoutes");
const subscriptionController = require("./src/controller/Subscription/subscriptionController");
const equipmentRoutes = require("./src/routes/Gym_Owner/equipment");
const gymRoutes = require("./src/routes/Gym_Owner/gym");
const clientRoutes = require("./src/routes/Client/client");
const gymBookingRoutes = require("./src/routes/Client/gymBooking");
const contactUsRouter = require("./src/routes/Contactus/contactUs");
const {
  router: clientGymRegistrationRoutes,
  gymOwnerRouter,
} = require("./src/routes/Gym_Owner/clientGymRegistration");
const gymReviewRoutes = require("./src/routes/Gym_Owner/gymReviewRoutes");
const {
  privateRouter: gymAdRoutes,
  publicRouter: publicAdRoutes,
} = require("./src/routes/Gym_Owner/gymAdRoutes");

// Trainer Routes
const trainerRegistrationRoutes = require("./src/routes/Trainer/trainerRegistrationRoutes");
const trainerSessionRoutes = require("./src/routes/Trainer/trainerSessionRoutes");
const clientTrainerSessionsRoutes = require("./src/routes/Client/clientTrainerSessions");
const progressRoutes = require("./src/routes/Trainer/progressRoutes");
const trainerTipsRoutes = require("./src/routes/Trainer/trainerTipsRoutes");

const app = express();
const PORT = process.env.PORT || 4070;

// Configure CORS with specific origin and credentials
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Webhook endpoint must be before express.json() middleware
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  subscriptionController.handleWebhook
);

// Regular middleware for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User and gym-related routes
app.use("/api/user", userRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/gym", gymRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/gym-booking", gymBookingRoutes);
app.use("/api/gym-reviews", gymReviewRoutes); // for public/client
app.use("/api/gym-owner/gym-reviews", gymReviewRoutes); // for owner dashboard

// Gym ads routes - private routes require authentication
app.use("/api/gym-ads", gymAdRoutes);

// Public ad routes - no authentication required
app.use("/api/public/ads", publicAdRoutes);

// Contact us router and route
app.use("/api/contactUs", contactUsRouter);

app.use("/api", clientGymRegistrationRoutes);
app.use("/api/gymOwner", gymOwnerRouter);

// Trainer routes
app.use("/api/trainer/registration", trainerRegistrationRoutes);
app.use("/api/trainer/session", trainerSessionRoutes);
app.use("/api/clientTrainerSessions", clientTrainerSessionsRoutes);
app.use("/api/trainer/progress", progressRoutes);
app.use("/api/trainer/tips", trainerTipsRoutes);

// Admin routes
app.use("/api/admin/clients", require("./src/routes/Admin/clients"));
app.use("/api/admin/gyms", require("./src/routes/Admin/gyms"));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to db and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
