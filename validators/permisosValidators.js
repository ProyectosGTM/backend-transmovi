// validators/permisosValidators.js

const { check } = require('express-validator');

const validatePermisoCreation = [
  check('nombre')
    .notEmpty().withMessage('El nombre del permiso es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  check('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder los 255 caracteres'),
];

const validatePermisoUpdate = [
  check('nombre')
    .optional()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  check('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder los 255 caracteres'),
];

module.exports = {
  validatePermisoCreation,
  validatePermisoUpdate,
};
