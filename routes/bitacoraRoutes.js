// routes/bitacoraRoutes.js

const express = require('express');
const { getAllBitacora } = require('../controllers/bitacoraController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/bitacora', verifyToken, checkRole(['admin', 'superadmin']), getAllBitacora);

module.exports = router;
