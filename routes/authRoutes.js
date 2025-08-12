// routes/authRoutes.js

const express = require('express');
const { login } = require('../controllers/authController.js');
const { validateLogin } = require('../validators/authValidators.js'); // Asumiendo que tienes validaciones
const router = express.Router();

// Ruta para el login
router.post('/login', validateLogin, login);

module.exports = router;
