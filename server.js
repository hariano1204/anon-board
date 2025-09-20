require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const apiRoutes = require('./routes/api'); // ✅ rutas de la API

const app = express();

// ✅ Configuración de seguridad (headers)
app.use(
  helmet({
    hidePoweredBy: false // 👈 dejamos el header X-Powered-By para FCC
  })
);
app.use(helmet.dnsPrefetchControl({ allow: false }));   // ❌ No prefetch DNS
app.use(helmet.frameguard({ action: 'sameorigin' }));   // ❌ Solo iframes propios
app.use(helmet.referrerPolicy({ policy: 'same-origin' })); // ❌ Referrer solo en el mismo origen

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Servir archivos estáticos (CSS, imágenes, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas de la API
app.use('/api', apiRoutes);

// ✅ Servir la página principal
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

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
