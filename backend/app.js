const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const env = require("dotenv").config();

//CONNEXION A LA BASE DE DONNEES//

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

  //MIDDLEWARES//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// ROUTES //
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/rooms", require("./src/routes/rooms"));
app.use("/api/bookings", require("./src/routes/bookings"));

//PORT//

app.listen(process.env.PORT || 5000);
console.log("Server is running on port 5000");

module.exports = app;