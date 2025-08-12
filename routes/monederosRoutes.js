// routes/monederosRoutes.js

const express = require('express');
const {
  getAllMonederos,
  getMonederoById,
  getMonederoByNumeroSerie,
  createMonedero,
  updateMonedero,
  deleteMonedero,
  modificarSaldo,
} = require('../controllers/monederosController');
const { validateMonederoCreation, validateMonederoUpdate, validateModificarSaldo } = require('../validators/monederosValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/monederos', verifyToken, checkRole(['admin', 'superadmin']), getAllMonederos);
router.get('/monederos/:id', verifyToken, checkRole(['admin', 'superadmin']), getMonederoById);
router.get('/monederos/serie/:numeroSerie', verifyToken, checkRole(['admin', 'superadmin']), getMonederoByNumeroSerie);
router.post('/monederos', verifyToken, checkRole(['admin']), validateMonederoCreation, createMonedero);
router.put('/monederos/:id', verifyToken, checkRole(['admin']), validateMonederoUpdate, updateMonedero);
router.delete('/monederos/:id', verifyToken, checkRole(['admin']), deleteMonedero);

module.exports = router;
