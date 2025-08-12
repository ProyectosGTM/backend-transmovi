// controllers/bitacoraRoutes.js

const { Bitacora } = require('../models');

// Obtener todos los registros de la bitácora
const getAllBitacora = async (req, res, next) => {
  try {
    const bitacora = await Bitacora.findAll();
    if (bitacora.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros en la bitácora' });
    }
    res.status(200).json({ message: 'Registros obtenidos exitosamente', bitacora });
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

module.exports = { getAllBitacora };
