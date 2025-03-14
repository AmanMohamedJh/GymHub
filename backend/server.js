const express = require("express");
const App = express();
require("dotenv").config();
const mongoose = require("mongoose");

//import of user.js by naming it userRoutes

const userRoutes = require("./src/routes/user");

const PORT = process.env.PORT || 4070;

//middlewares
App.use(express.json());
App.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Routes
App.use("/api/user", userRoutes); //importing the route for user

//listen for request

//listen for request

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    App.listen(process.env.PORT, () => {
      console.log("Connected to DB & in PORT : ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
