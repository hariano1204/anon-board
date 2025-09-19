require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const apiRoutes = require('./routes/api'); // ✅ importa las rutas

const app = express();

// ✅ Configuración de headers de seguridad según FCC
app.use(helmet({
  hidePoweredBy: false // 👈 necesario para que FCC vea "X-Powered-By: Express"
}));
app.use(helmet.dnsPrefetchControl({ allow: false }));   // 👈 Error 3
app.use(helmet.frameguard({ action: 'sameorigin' }));   // 👈 Error 2
app.use(helmet.referrerPolicy({ policy: 'same-origin' })); // 👈 Error 4

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas de la API
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

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
