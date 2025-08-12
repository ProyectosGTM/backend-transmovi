// validators/pasajerosValidators.js

const { check } = require('express-validator');

const validatePasajeroCreation = [
  check('Nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('ApellidoPaterno').notEmpty().withMessage('El apellido paterno es obligatorio'),
  check('FechaNacimiento').isDate().withMessage('La fecha de nacimiento es obligatoria y debe ser válida'),
  check('Correo').optional().isEmail().withMessage('Debe ser un correo electrónico válido'),
  check('Telefono').optional().isNumeric().withMessage('El teléfono debe contener solo números'),
  check('Estatus').optional().isInt({ min: 0, max: 1 }).withMessage('El estatus debe ser un valor entero entre 0 y 1'),
];

const validatePasajeroUpdate = [
  check('Nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  check('ApellidoPaterno').optional().notEmpty().withMessage('El apellido paterno no puede estar vacío'),
  check('FechaNacimiento').optional().isDate().withMessage('La fecha de nacimiento debe ser válida'),
  check('Correo').optional().isEmail().withMessage('Debe ser un correo electrónico válido'),
  check('Telefono').optional().isNumeric().withMessage('El teléfono debe contener solo números'),
  check('Estatus').optional().isInt({ min: 0, max: 1 }).withMessage('El estatus debe ser un valor entero entre 0 y 1'),
];

module.exports = {
  validatePasajeroCreation,
  validatePasajeroUpdate,
};
