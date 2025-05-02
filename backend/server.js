require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

//import of user.js by naming it userRoutes
const userRoutes = require("./src/routes/user");
const subscriptionRoutes = require("./src/routes/Subscription/subscriptionRoutes");
const subscriptionController = require("./src/controller/Subscription/subscriptionController");
const equipmentRoutes = require("./src/routes/Gym_Owner/equipment");
const gymRoutes = require("./src/routes/Gym_Owner/gym");
const clientRoutes = require("./src/routes/Client/client");
const contactUsRouter = require("./src/routes/Contactus/contactUs");
const {
  router: clientGymRegistrationRoutes,
  gymOwnerRouter,
} = require("./src/routes/Gym_Owner/clientGymRegistration");
const gymReviewRoutes = require("./src/routes/Gym_Owner/gymReviewRoutes");

//Trainer Routes

const trainerSessionRoutes = require("./src/routes/Trainer/trainerSessionRoutes");
const workoutPlanRoutes = require("./src/routes/Trainer/workoutPlanRoutes");
const progressRoutes = require("./src/routes/Trainer/progressRoutes");

const app = express();
const PORT = process.env.PORT || 4070;

// Configure CORS with specific origin
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: false,
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

//routes
app.use("/api/user", userRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/gym", gymRoutes);
app.use("/api/client", clientRoutes);

app.use("/api/gym-reviews", gymReviewRoutes); // for public/client
app.use("/api/gym-owner/gym-reviews", gymReviewRoutes); // for owner dashboard

//contact us router and route
app.use("/api/contactUs", contactUsRouter);

app.use("/api", clientGymRegistrationRoutes);
app.use("/api/gymOwner", gymOwnerRouter);

// Trainer routes
const trainerRegistrationRoutes = require("./src/routes/Trainer/trainerRegistrationRoutes");
app.use("/api/trainer/registration", trainerRegistrationRoutes);
app.use("/api/trainer/session", trainerSessionRoutes);
app.use("/api/trainer/workout-plan", workoutPlanRoutes);
app.use("/api/trainer/progress", progressRoutes);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//connect to db
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
