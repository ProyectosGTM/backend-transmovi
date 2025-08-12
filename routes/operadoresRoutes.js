// routes/operadoresRoutes.js

const express = require('express');
const {
  getAllOperadores,
  getOperadorById,
  createOperador,
  updateOperador,
  deleteOperador
} = require('../controllers/operadoresController');
const { validateOperadorCreation, validateOperadorUpdate } = require('../validators/operadoresValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/operadores', verifyToken, checkRole(['admin', 'superadmin']), getAllOperadores);
router.get('/operadores/:id', verifyToken, checkRole(['admin', 'superadmin']), getOperadorById);
router.post('/operadores', verifyToken, checkRole(['admin']), validateOperadorCreation, createOperador);
router.put('/operadores/:id', verifyToken, checkRole(['admin']), validateOperadorUpdate, updateOperador);
router.delete('/operadores/:id', verifyToken, checkRole(['admin']), deleteOperador);

module.exports = router;
