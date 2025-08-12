// validators/operadoresValidators.js

const { check } = require('express-validator');

const validateOperadorCreation = [
  check('Nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('ApellidoPaterno').notEmpty().withMessage('El apellido paterno es obligatorio'),
  check('NumeroLicencia').notEmpty().withMessage('El número de licencia es obligatorio'),
  check('FechaNacimiento').isDate().withMessage('Debe ser una fecha válida'),
  check('Correo').isEmail().withMessage('Debe ser un correo electrónico válido'),
  check('Telefono').isLength({ min: 10, max: 10 }).isNumeric().withMessage('El teléfono debe tener 10 dígitos y contener solo números'),
  check('Estatus').isIn([0, 1]).withMessage('El estatus debe ser 0 (Inactivo) o 1 (Activo)')
];

const validateOperadorUpdate = [
  check('Nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  check('ApellidoPaterno').optional().notEmpty().withMessage('El apellido paterno no puede estar vacío'),
  check('NumeroLicencia').optional().notEmpty().withMessage('El número de licencia no puede estar vacío'),
  check('FechaNacimiento').optional().isDate().withMessage('Debe ser una fecha válida'),
  check('Correo').optional().isEmail().withMessage('Debe ser un correo electrónico válido'),
  check('Telefono').optional().isLength({ min: 10, max: 10 }).isNumeric().withMessage('El teléfono debe tener 10 dígitos y contener solo números'),
  check('Estatus').optional().isIn([0, 1]).withMessage('El estatus debe ser 0 (Inactivo) o 1 (Activo)')
];

module.exports = {
  validateOperadorCreation,
  validateOperadorUpdate
};
