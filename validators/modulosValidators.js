// validators/modulosValidators.js

const { check } = require('express-validator');

const validateModuloCreation = [
  check('Nombre').notEmpty().withMessage('El nombre del módulo es obligatorio'),
  check('Descripcion').optional().isLength({ max: 255 }).withMessage('La descripción no puede exceder los 255 caracteres')
];

module.exports = {
  validateModuloCreation
};
