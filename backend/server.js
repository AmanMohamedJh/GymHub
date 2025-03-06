const express = require("express");
const App = express();
require("dotenv").config();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 4070;
//middlewares

//Routes

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
