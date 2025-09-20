require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const apiRoutes = require('./routes/api');

const app = express();

// 🔧 Fuerza X-Powered-By para que FCC no se confunda (algunos proxies lo quitan)
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Express');
  next();
});

// 🔐 Headers EXACTOS que FCC testea
app.use(helmet.frameguard({ action: 'sameorigin' }));          // X-Frame-Options: SAMEORIGIN  (Test 2)
app.use(helmet.dnsPrefetchControl({ allow: false }));          // X-DNS-Prefetch-Control: off (Test 3)
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));     // Referrer-Policy: same-origin (Test 4)

// Básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 estáticos como en la demo FCC
app.use('/public', express.static(path.join(__dirname, 'public')));

// DB
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

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
