require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const apiRoutes = require('./routes/api');

const app = express();

// ✅ Configuración EXACTA para pasar los tests de FCC
// Forzamos que siempre aparezca "X-Powered-By: Express"
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Express");
  next();
});

// Solo los middlewares que pide FCC
app.use(helmet.dnsPrefetchControl({ allow: false }));       // ❌ Error 3 → arreglado
app.use(helmet.frameguard({ action: 'sameorigin' }));       // ❌ Error 2 → arreglado
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));  // ❌ Error 4 → arreglado

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// ✅ Rutas de la API
app.use('/api', apiRoutes);

// ✅ Servir la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ✅ Servir boards (/b/general/, etc.)
app.get('/b/:board/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'board.html'));
});

// ✅ Servir un thread específico (/b/:board/:threadid/)
app.get('/b/:board/:threadid', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'thread.html'));
});

// ✅ Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
