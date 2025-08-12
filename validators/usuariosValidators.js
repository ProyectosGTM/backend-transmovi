// validators/usuariosValidators.js

const { check } = require('express-validator');

const validateUserCreation = [
  check('UserName')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre de usuario no puede exceder los 100 caracteres'),
  check('Password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  check('Telefono')
    .optional()
    .isMobilePhone().withMessage('El teléfono debe ser un número válido')
    .isLength({ max: 20 }).withMessage('El teléfono no puede exceder los 20 caracteres'),
  check('Nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  check('ApellidoPaterno')
    .notEmpty().withMessage('El apellido paterno es obligatorio')
    .isLength({ max: 100 }).withMessage('El apellido paterno no puede exceder los 100 caracteres'),
  check('IdRol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isInt().withMessage('El rol debe ser un identificador numérico válido'),
  check('IdCliente')
    .notEmpty().withMessage('El cliente es obligatorio')
    .isInt().withMessage('El cliente debe ser un identificador numérico válido'),
];

const validateUserUpdate = [
  check('UserName')
    .optional()
    .notEmpty().withMessage('El nombre de usuario no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El nombre de usuario no puede exceder los 100 caracteres'),
  check('Password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  check('Telefono')
    .optional()
    .isMobilePhone().withMessage('El teléfono debe ser un número válido')
    .isLength({ max: 20 }).withMessage('El teléfono no puede exceder los 20 caracteres'),
  check('Nombre')
    .optional()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  check('ApellidoPaterno')
    .optional()
    .notEmpty().withMessage('El apellido paterno no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El apellido paterno no puede exceder los 100 caracteres'),
  check('IdRol')
    .optional()
    .notEmpty().withMessage('El rol no puede estar vacío')
    .isInt().withMessage('El rol debe ser un identificador numérico válido'),
  check('IdCliente')
    .optional()
    .notEmpty().withMessage('El cliente no puede estar vacío')
    .isInt().withMessage('El cliente debe ser un identificador numérico válido'),
];

module.exports = {
  validateUserCreation,
  validateUserUpdate,
};
