"use strict";
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");

const app = express();

// ✅ Middlewares de seguridad requeridos por FCC
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: "sameorigin" }));   // Error 2
app.use(helmet.dnsPrefetchControl({ allow: false }));   // Error 3
app.use(helmet.referrerPolicy({ policy: "same-origin" })); // Error 4

// ✅ Otros middlewares
app.use(cors({ origin: "*" })); // FCC necesita acceso libre
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Archivos estáticos
app.use("/public", express.static(path.join(__dirname, "/public")));

// ✅ Vistas
app.route("/b/:board/").get((req, res) => {
  res.sendFile(path.join(__dirname, "/views/board.html"));
});

app.route("/b/:board/:threadid").get((req, res) => {
  res.sendFile(path.join(__dirname, "/views/thread.html"));
});

app.route("/").get((req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// ✅ FCC testing routes
fccTestingRoutes(app);

// ✅ API routes
apiRoutes(app);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).type("text").send("Not Found");
});

// ✅ Conexión a MongoDB (opcional para FCC)
mongoose.connect(process.env.MONGO_URI || "", {})
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(() => console.log("⚠️ MongoDB no conectado (modo demo)"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto " + PORT);
});

module.exports = app; // 👈 importante para FCC tests
