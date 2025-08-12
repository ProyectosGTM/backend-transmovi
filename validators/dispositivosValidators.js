// validators/dispositivosValidators.js

const { check } = require('express-validator');

const validateDispositivoCreation = [
  check('NumeroSerie').notEmpty().withMessage('El número de serie es obligatorio'),
  check('Marca').notEmpty().withMessage('La marca es obligatoria'),
  check('Modelo').notEmpty().withMessage('El modelo es obligatorio'),
  check('Estatus').isIn([0, 1]).withMessage('El estatus debe ser 0 (Inactivo) o 1 (Activo)')
];

const validateDispositivoUpdate = [
  check('NumeroSerie').optional().notEmpty().withMessage('El número de serie no puede estar vacío'),
  check('Marca').optional().notEmpty().withMessage('La marca no puede estar vacía'),
  check('Modelo').optional().notEmpty().withMessage('El modelo no puede estar vacío'),
  check('Estatus').optional().isIn([0, 1]).withMessage('El estatus debe ser 0 (Inactivo) o 1 (Activo)')
];

module.exports = {
  validateDispositivoCreation,
  validateDispositivoUpdate
};
