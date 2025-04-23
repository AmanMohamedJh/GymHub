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
const clientGymRegistrationRoutes = require("./src/routes/Gym_Owner/clientGymRegistration");

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

//contact us router and route
app.use("/api/contactUs", contactUsRouter);

app.use("/api/gymOwner", clientGymRegistrationRoutes);

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
