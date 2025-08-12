// routes/pasajerosRoutes.js

const express = require('express');
const {
  getAllPasajeros,
  getPasajeroById,
  createPasajero,
  updatePasajero,
  deletePasajero
} = require('../controllers/pasajerosController');
const { validatePasajeroCreation, validatePasajeroUpdate } = require('../validators/pasajerosValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas de pasajeros
router.get('/pasajeros', verifyToken, checkRole(['admin', 'operador']), getAllPasajeros);
router.get('/pasajeros/:id', verifyToken, checkRole(['admin', 'operador']), getPasajeroById);
router.post('/pasajeros', verifyToken, checkRole(['admin']), validatePasajeroCreation, createPasajero);
router.put('/pasajeros/:id', verifyToken, checkRole(['admin']), validatePasajeroUpdate, updatePasajero);
router.delete('/pasajeros/:id', verifyToken, checkRole(['admin']), deletePasajero);

module.exports = router;
