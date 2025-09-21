"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");

const app = express();

app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(cors({ origin: "*" })); // For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/b/:board/").get((req, res) => {
  res.sendFile(path.join(__dirname, "/views/board.html"));
});

app.route("/b/:board/:threadid").get((req, res) => {
  res.sendFile(path.join(__dirname, "/views/thread.html"));
});

app.route("/").get((req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// For FCC testing purposes
fccTestingRoutes(app);

// Routing for API
apiRoutes(app);

// 404 Not Found Middleware
app.use((req, res) => {
  res.status(404).type("text").send("Not Found");
});

module.exports = app;
