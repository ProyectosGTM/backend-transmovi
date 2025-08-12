// routes/dispositivosRoutes.js

const express = require('express');
const {
  getAllDispositivos,
  getDispositivoById,
  createDispositivo,
  updateDispositivo,
  deleteDispositivo
} = require('../controllers/dispositivosController');
const { validateDispositivoCreation, validateDispositivoUpdate } = require('../validators/dispositivosValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/dispositivos', verifyToken, checkRole(['admin', 'superadmin']), getAllDispositivos);
router.get('/dispositivos/:id', verifyToken, checkRole(['admin', 'superadmin']), getDispositivoById);
router.post('/dispositivos', verifyToken, checkRole(['admin']), validateDispositivoCreation, createDispositivo);
router.put('/dispositivos/:id', verifyToken, checkRole(['admin']), validateDispositivoUpdate, updateDispositivo);
router.delete('/dispositivos/:id', verifyToken, checkRole(['admin']), deleteDispositivo);

module.exports = router;
