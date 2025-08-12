// routes/usuariosRoutes.js

const express = require('express');
const {
  getAllUsuarios,
  getUsuariosById,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios
} = require('../controllers/usuariosController');
const { validateUserCreation, validateUserUpdate } = require('../validators/usuariosValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas protegidas para obtener usuarios, accesibles solo por admin y superadmin
router.get('/usuarios', verifyToken, checkRole(['admin', 'superadmin']), getAllUsuarios);
router.get('/usuarios/:id', verifyToken, checkRole(['admin', 'superadmin']), getUsuariosById);

// Rutas para crear, actualizar y eliminar usuarios, accesibles solo por admin
//router.post('/usuarios', validateUserCreation, createUsuarios); //solo para el primer usuario
router.post('/usuarios', verifyToken, checkRole(['admin']), validateUserCreation, createUsuarios);
router.put('/usuarios/:id', verifyToken, checkRole(['admin']), validateUserUpdate, updateUsuarios);
router.delete('/usuarios/:id', verifyToken, checkRole(['admin']), deleteUsuarios);

module.exports = router;
