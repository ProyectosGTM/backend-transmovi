// validators/monederosValidators.js

const { check } = require('express-validator');

const validateMonederoCreation = [
  check('NumeroSerie').notEmpty().withMessage('El número de serie es obligatorio'),
  check('FechaActivacion').optional().isISO8601().withMessage('La fecha de activación debe ser válida'),
  check('Saldo')
    .isDecimal()
    .withMessage('El saldo debe ser un valor decimal válido')
    .custom(value => value >= 0)
    .withMessage('El saldo no puede ser negativo'),
  check('Estatus').isIn([0, 1]).withMessage('El estatus debe ser 0 (Inactivo) o 1 (Activo)'),
];

const validateMonederoUpdate = [
  check('NumeroSerie').optional().notEmpty().withMessage('El número de serie no puede estar vacío'),
  check('FechaActivacion').optional().isISO8601().withMessage('La fecha de activación debe ser válida'),
  check('Saldo')
    .optional()
    .isDecimal()
    .withMessage('El saldo debe ser un valor decimal válido')
    .custom(value => value >= 0)
    .withMessage('El saldo no puede ser negativo'),
  check('Estatus').optional().isIn([0, 1]).withMessage('El estatus debe ser 0 (Inactivo) o 1 (Activo)'),
];

module.exports = {
  validateMonederoCreation,
  validateMonederoUpdate,
};
