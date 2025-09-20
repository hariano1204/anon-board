require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const apiRoutes = require('./routes/api');
const app = express();

// ✅ Configuración de seguridad según FCC
app.use(helmet.hidePoweredBy());  // Quita X-Powered-By
app.use(helmet.frameguard({ action: 'sameorigin' }));  // Error 2
app.use(helmet.dnsPrefetchControl({ allow: false }));  // Error 3
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));  // Error 4

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// API
app.use('/api', apiRoutes);

// Vistas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/b/:board/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'board.html'));
});
app.get('/b/:board/:threadid', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'thread.html'));
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
