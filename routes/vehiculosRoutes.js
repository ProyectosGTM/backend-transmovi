// routes/vehiculosRoutes.js

const express = require('express');
const {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} = require('../controllers/vehiculosController');
const { validateVehiculoCreation, validateVehiculoUpdate } = require('../validators/vehiculosValidators');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/vehiculos', verifyToken, checkRole(['admin', 'superadmin']), getAllVehiculos);
router.get('/vehiculos/:id', verifyToken, checkRole(['admin', 'superadmin']), getVehiculoById);
router.post('/vehiculos', verifyToken, checkRole(['admin']), validateVehiculoCreation, createVehiculo);
router.put('/vehiculos/:id', verifyToken, checkRole(['admin']), validateVehiculoUpdate, updateVehiculo);
router.delete('/vehiculos/:id', verifyToken, checkRole(['admin']), deleteVehiculo);

module.exports = router;
