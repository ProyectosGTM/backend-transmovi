// validators/authValidators

const { check } = require('express-validator');

const validateLogin = [
  check('email').isEmail().withMessage('Debe ser un email válido'),
  check('password').notEmpty().withMessage('La contraseña es obligatoria')
];

module.exports = {
  validateLogin,
};
