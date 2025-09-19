require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const apiRoutes = require('./routes/api'); // ✅ importa las rutas

const app = express();

// 🔒 Middlewares de seguridad (Helmet configurado de una vez)
app.use(
  helmet({
    dnsPrefetchControl: { allow: false }, // ✅ test 3
    frameguard: { action: 'sameorigin' }, // ✅ test 2
    referrerPolicy: { policy: 'same-origin' } // ✅ test 4
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌐 Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// 📌 Rutas de la API
app.use('/api', apiRoutes);

// 🌍 Root de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// 🚀 Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
