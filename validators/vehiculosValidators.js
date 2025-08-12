// validators/vehiculosValidators.js

const { check } = require('express-validator');

const validateVehiculoCreation = [
  check('Marca').notEmpty().withMessage('La marca es obligatoria'),
  check('Modelo').notEmpty().withMessage('El modelo es obligatorio'),
  check('Ano').isInt({ min: 1900 }).withMessage('El año debe ser mayor a 1900'),
  check('Placa').notEmpty().withMessage('La placa es obligatoria'),
  check('NumeroEconomico').notEmpty().withMessage('El número económico es obligatorio'),
  check('Estatus').isIn([0, 1]).withMessage('El estatus debe ser 0 (Inactivo) o 1 (Activo)'),
  check('IdOperador').isInt().withMessage('El ID del operador debe ser un número entero'),
  check('IdDispositivo').isInt().withMessage('El ID del dispositivo debe ser un número entero')
];

const validateVehiculoUpdate = [
  check('Marca').optional().notEmpty().withMessage('La marca no puede estar vacía'),
  check('Modelo').optional().notEmpty().withMessage('El modelo no puede estar vacío'),
  check('Ano').optional().isInt({ min: 1900 }).withMessage('El año debe ser mayor a 1900'),
  check('Placa').optional().notEmpty().withMessage('La placa no puede estar vacía'),
  check('NumeroEconomico').optional().notEmpty().withMessage('El número económico no puede estar vacío'),
  check('Estatus').optional().isIn([0, 1]).withMessage('El estatus debe ser 0 (Inactivo) o 1 (Activo)'),
  check('IdOperador').optional().isInt().withMessage('El ID del operador debe ser un número entero'),
  check('IdDispositivo').optional().isInt().withMessage('El ID del dispositivo debe ser un número entero')
];
//apartado agregado
const validateEstatusChange = [
  check('Marca').optional().notEmpty().withMessage('La marca no puede estar vacía'),
  check('Modelo').optional().notEmpty().withMessage('El modelo no puede estar vacío'),
  check('Ano').optional().isInt({ min: 1900 }).withMessage('El año debe ser mayor a 1900'),
  check('Placa').optional().notEmpty().withMessage('La placa no puede estar vacía'),
  check('NumeroEconomico').optional().notEmpty().withMessage('El número económico no puede estar vacío'),
  check('Estatus').exists().withMessage('El estatus es obligatorio').isIn([0, 1]).withMessage('El estatus debe ser 0 (Inactivo) o 1 (Activo)'),
  check('IdOperador').optional().isInt().withMessage('El ID del operador debe ser un número entero'),
  check('IdDispositivo').optional().isInt().withMessage('El ID del dispositivo debe ser un número entero')
];

module.exports = {
  validateVehiculoCreation,
  validateVehiculoUpdate,
  validateEstatusChange
};
