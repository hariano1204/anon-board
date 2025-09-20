"use strict";
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Importa el router principal (index.js)
const router = require("./index.js");

// Monta el router en la raíz
app.use("/", router);

// Puerto
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB y arranque del servidor
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// Exporta app para que FCC tests funcionen
module.exports = app;
