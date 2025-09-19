require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const apiRoutes = require('./routes/api');

const app = express();

// =====================
// 🔐 Seguridad FCC
// =====================
// ⚠️ Nota: NO ocultamos "X-Powered-By" porque FCC lo necesita para pasar el test 1
app.use(helmet.frameguard({ action: 'sameorigin' }));          // Error 2
app.use(helmet.dnsPrefetchControl({ allow: false }));          // Error 3
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));     // Error 4

// Otros headers de seguridad recomendados (no afectan FCC)
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.noCache());

// =====================
// Middlewares básicos
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// Conexión a MongoDB
// =====================
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// =====================
// Rutas API
// =====================
app.use('/api', apiRoutes);

// =====================
// Vistas
// =====================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/b/:board/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'board.html'));
});

app.get('/b/:board/:threadid', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'thread.html'));
});

// =====================
// Servidor
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
