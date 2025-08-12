// app.js

const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./utils/errorHandler');
const usuariosRoutes = require('./routes/usuariosRoutes');
const authRoutes = require('./routes/authRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const permisosRoutes = require('./routes/permisosRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const modulosRoutes = require('./routes/modulosRoutes');
const bitacoraRoutes = require('./routes/bitacoraRoutes');
const dispositivosRoutes = require('./routes/dispositivosRoutes');
const operadoresRoutes = require('./routes/operadoresRoutes');
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const monederosRoutes = require('./routes/monederosRoutes');
const pasajerosRoutes = require('./routes/pasajerosRoutes');
const transaccionesRoutes = require('./routes/transaccionesRoutes');
require('dotenv').config(); // Cargar variables de entorno

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/', authRoutes);
app.use('/api/', usuariosRoutes);
app.use('/api/', rolesRoutes);
app.use('/api/', permisosRoutes);
app.use('/api/', clientesRoutes);
app.use('/api/', modulosRoutes);
app.use('/api/', bitacoraRoutes);
app.use('/api/', dispositivosRoutes);
app.use('/api/', operadoresRoutes);
app.use('/api/', vehiculosRoutes);
app.use('/api/', monederosRoutes);
app.use('/api/', pasajerosRoutes);
app.use('/api/', transaccionesRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware global de manejo de errores
app.use(errorHandler);

module.exports = app;
