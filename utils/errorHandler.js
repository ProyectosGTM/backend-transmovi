// utils/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.stack}`); // Log completo del error para la depuración

  // Manejo de errores de validación (por ejemplo, express-validator)
  if (err.name === 'ValidationError' || err.errors) {
    return res.status(400).json({
      message: 'Error de validación',
      errors: err.errors || err.array() // En caso de que sea un array de errores de validación
    });
  }

  // Manejo de errores de autenticación (por ejemplo, problemas con JWT)
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Token inválido o no autorizado',
      error: err.message
    });
  }

  // Manejo de errores específicos de la base de datos (por ejemplo, Sequelize)
  if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Error en la base de datos',
      errors: err.errors.map(error => error.message) // Mostrar los mensajes de error de Sequelize
    });
  }

  // Si es un error no controlado (error del servidor)
  return res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message
  });
};

module.exports = { errorHandler };
