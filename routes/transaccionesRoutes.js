// routes/transaccionesRoutes.js

const express = require('express');
const { createTransaccion, getAllTransacciones } = require('../controllers/transaccionesController');
const { validateTransaccionCreation } = require('../validators/transaccionesValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas para transacciones
router.post('/transacciones', verifyToken, checkRole(['admin', 'operador']), validateTransaccionCreation, createTransaccion);
router.get('/transacciones', verifyToken, checkRole(['admin', 'operador']), getAllTransacciones);

module.exports = router;
