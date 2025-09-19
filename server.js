require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const apiRoutes = require('./routes/api');

const app = express();

// ✅ Seguridad con Helmet
app.use(helmet({
  hidePoweredBy: false // 👈 FCC espera ver "X-Powered-By: Express"
}));

// ✅ Forzar cabeceras que FreeCodeCamp testea
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");    // Error 2
  res.setHeader("X-DNS-Prefetch-Control", "off");    // Error 3
  res.setHeader("Referrer-Policy", "same-origin");   // Error 4
  next();
});

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// ✅ Rutas de la API
app.use('/api', apiRoutes);

// ✅ Servir index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ✅ Servir la vista de cada board (/b/general/, etc.)
app.get('/b/:board/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'board.html'));
});

// ✅ Servir la vista de un thread (/b/:board/:threadid/)
app.get('/b/:board/:threadid', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'thread.html'));
});

// ✅ Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
