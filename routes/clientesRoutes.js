// routes/clientesRoutes.js

const express = require('express');
const {
  createCliente,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
} = require('../controllers/clientesController');
const { validateClientCreation, validateClientUpdate } = require('../validators/clientesValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware'); // Asumiendo autenticación y roles

const router = express.Router();

// Rutas públicas o protegidas por autenticación
router.get('/clientes', verifyToken, checkRole(['admin', 'user']), getAllClientes);
router.get('/clientes/:id', verifyToken, checkRole(['admin', 'user']), getClienteById);

// Rutas protegidas con validaciones y autenticación para creación y actualización de clientes
router.post('/clientes', verifyToken, checkRole(['admin']), validateClientCreation, createCliente);
router.put('/clientes/:id', verifyToken, checkRole(['admin']), validateClientUpdate, updateCliente);

// Ruta para eliminar un cliente (protegida por autenticación y roles)
router.delete('/clientes/:id', verifyToken, checkRole(['admin']), deleteCliente);

module.exports = router;
