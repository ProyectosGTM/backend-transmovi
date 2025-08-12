// routes/rolesRoutes.js

const express = require('express');
const { createRole, getAllRoles } = require('../controllers/rolesController');
const { validateRoleCreation } = require('../validators/rolesValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener todos los roles, protegida por autenticación y roles
router.get('/roles', verifyToken, checkRole(['admin', 'superadmin']), getAllRoles);

// Ruta para crear un nuevo rol, protegida por autenticación y con validación
router.post('/roles', verifyToken, checkRole(['admin']), validateRoleCreation, createRole);

module.exports = router;
