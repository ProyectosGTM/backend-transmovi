// routes/permisosRoutes.js

const express = require('express');
const {
  createPermiso,
  getAllPermisos,
} = require('../controllers/permisosController');
const { validatePermisoCreation } = require('../validators/permisosValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware'); // Asumiendo autenticación y roles

const router = express.Router();

// Ruta para obtener todos los permisos, protegida por autenticación y roles
router.get('/permisos', verifyToken, checkRole(['admin', 'user']), getAllPermisos);

// Ruta para crear un nuevo permiso, protegida y con validación
router.post('/permisos', verifyToken, checkRole(['admin']), validatePermisoCreation, createPermiso);

module.exports = router;
