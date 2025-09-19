const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const app = express();
const apiRoutes = require('./routes/api');

// ✅ Middleware de seguridad que FCC valida
app.use(
  helmet({
    frameguard: { action: 'sameorigin' },      // solo iframes propios
    dnsPrefetchControl: { allow: false },      // no permitir prefetch
    referrerPolicy: { policy: 'same-origin' }  // referrer solo mismo dominio
  })
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Montar rutas de la API en /api
app.use('/api', apiRoutes);

// ✅ Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error(err));

// ✅ Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`)
);
