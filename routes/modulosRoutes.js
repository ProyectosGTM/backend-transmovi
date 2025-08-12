// routes/modulosRoutes.js

const express = require('express');
const {
  createModulo,
  getAllModulos,
  assignPermisosToModulo
} = require('../controllers/modulosController');  // Importar controladores
const { validateModuloCreation } = require('../validators/modulosValidators'); // Importar validaciones
const { verifyToken, checkRole } = require('../middlewares/authMiddleware'); // Importar middleware de autenticación
const router = express.Router();

// Ruta para crear un nuevo módulo (solo accesible por admin)
router.post('/modulos', verifyToken, checkRole(['admin']), validateModuloCreation, createModulo);

// Ruta para obtener todos los módulos
router.get('/modulos', verifyToken, checkRole(['admin']), getAllModulos);

// Ruta para asignar permisos a un módulo
router.post('/modulos/:id/permisos', verifyToken, checkRole(['admin']), assignPermisosToModulo);

module.exports = router;
