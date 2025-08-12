// validators/rolesValidators.js

const { check } = require('express-validator');

const validateRoleCreation = [
  check('nombre')
    .notEmpty().withMessage('El nombre del rol es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  check('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder los 255 caracteres'),
  check('permisosIds')
    .optional()
    .isArray().withMessage('Los permisos deben ser un arreglo de identificadores válidos')
    .custom((value) => value.every((id) => Number.isInteger(id)))
    .withMessage('Cada permiso debe ser un identificador numérico válido'),
];

const validateRoleUpdate = [
  check('nombre')
    .optional()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  check('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder los 255 caracteres'),
  check('permisosIds')
    .optional()
    .isArray().withMessage('Los permisos deben ser un arreglo de identificadores válidos')
    .custom((value) => value.every((id) => Number.isInteger(id)))
    .withMessage('Cada permiso debe ser un identificador numérico válido'),
];

module.exports = {
  validateRoleCreation,
  validateRoleUpdate,
};
