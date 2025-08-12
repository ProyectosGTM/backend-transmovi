// validators/clientesValidators.js

const { check } = require('express-validator');

const validateClientCreation = [
  check('IdPadre')
    .notEmpty().withMessage('El campo IdPadre es obligatorio')
    .isLength({ max: 50 }).withMessage('El campo IdPadre no puede exceder los 50 caracteres'),
  
  check('RFC')
    .notEmpty().withMessage('El RFC es obligatorio')
    .isLength({ min: 12, max: 16 }).withMessage('El RFC debe tener entre 12 y 16 caracteres'),
  
  check('TipoPersona')
    .notEmpty().withMessage('El TipoPersona es obligatorio')
    .isInt().withMessage('El TipoPersona debe ser un número entero'),

  check('Estatus')
    .notEmpty().withMessage('El Estatus es obligatorio')
    .isInt().withMessage('El Estatus debe ser un número entero'),

  check('Logotipo')
    .optional()
    .isURL().withMessage('El Logotipo debe ser una URL válida'),

  check('Nombre')
    .optional()
    .isLength({ max: 255 }).withMessage('El Nombre no puede tener más de 255 caracteres'),

  check('ApellidoPaterno')
    .optional()
    .isLength({ max: 100 }).withMessage('El ApellidoPaterno no puede tener más de 100 caracteres'),

  check('ApellidoMaterno')
    .optional()
    .isLength({ max: 100 }).withMessage('El ApellidoMaterno no puede tener más de 100 caracteres'),

  check('Telefono')
    .optional()
    .isLength({ max: 10 }).withMessage('El Teléfono no puede tener más de 10 dígitos')
    .isNumeric().withMessage('El Teléfono debe contener solo números'),

  check('Correo')
    .optional()
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .isLength({ max: 100 }).withMessage('El correo no puede tener más de 100 caracteres'),

  check('Estado')
    .optional()
    .isLength({ max: 45 }).withMessage('El campo Estado no puede tener más de 45 caracteres'),

  check('Municipio')
    .optional()
    .isLength({ max: 45 }).withMessage('El campo Municipio no puede tener más de 45 caracteres'),

  check('Colonia')
    .optional()
    .isLength({ max: 45 }).withMessage('El campo Colonia no puede tener más de 45 caracteres'),

  check('Calle')
    .optional()
    .isLength({ max: 100 }).withMessage('El campo Calle no puede tener más de 100 caracteres'),

  check('EntreCalles')
    .optional()
    .isLength({ max: 45 }).withMessage('El campo EntreCalles no puede tener más de 45 caracteres'),

  check('NumeroExterior')
    .optional()
    .isLength({ max: 10 }).withMessage('El campo NumeroExterior no puede tener más de 10 caracteres'),

  check('NumeroInterior')
    .optional()
    .isLength({ max: 10 }).withMessage('El campo NumeroInterior no puede tener más de 10 caracteres'),

  check('CP')
    .optional()
    .isLength({ max: 5 }).withMessage('El código postal no puede tener más de 5 dígitos')
    .isNumeric().withMessage('El código postal debe contener solo números'),

  check('NombreEncargado')
    .optional()
    .isLength({ max: 100 }).withMessage('El campo NombreEncargado no puede tener más de 100 caracteres'),

  check('TelefonoEncargado')
    .optional()
    .isLength({ max: 10 }).withMessage('El teléfono del encargado no puede tener más de 10 dígitos')
    .isNumeric().withMessage('El teléfono del encargado debe contener solo números'),

  check('EmailEncargado')
    .optional()
    .isEmail().withMessage('Debe ser un correo electrónico válido para el encargado')
    .isLength({ max: 100 }).withMessage('El correo del encargado no puede tener más de 100 caracteres'),
];

const validateClientUpdate = [
  check('IdPadre')
    .optional()
    .isLength({ max: 50 }).withMessage('El campo IdPadre no puede exceder los 50 caracteres'),
  
  check('RFC')
    .optional()
    .isLength({ min: 12, max: 16 }).withMessage('El RFC debe tener entre 12 y 16 caracteres'),
  
  check('TipoPersona')
    .optional()
    .isInt().withMessage('El TipoPersona debe ser un número entero'),

  check('Estatus')
    .optional()
    .isInt().withMessage('El Estatus debe ser un número entero'),

  check('Logotipo')
    .optional()
    .isURL().withMessage('El Logotipo debe ser una URL válida'),

  check('Nombre')
    .optional()
    .isLength({ max: 255 }).withMessage('El Nombre no puede tener más de 255 caracteres'),

  check('ApellidoPaterno')
    .optional()
    .isLength({ max: 100 }).withMessage('El ApellidoPaterno no puede tener más de 100 caracteres'),

  check('ApellidoMaterno')
    .optional()
    .isLength({ max: 100 }).withMessage('El ApellidoMaterno no puede tener más de 100 caracteres'),

  check('Telefono')
    .optional()
    .isLength({ max: 10 }).withMessage('El Teléfono no puede tener más de 10 dígitos')
    .isNumeric().withMessage('El Teléfono debe contener solo números'),

  check('Correo')
    .optional()
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .isLength({ max: 100 }).withMessage('El correo no puede tener más de 100 caracteres'),

  check('Estado')
    .optional()
    .isLength({ max: 45 }).withMessage('El campo Estado no puede tener más de 45 caracteres'),

  check('Municipio')
    .optional()
    .isLength({ max: 45 }).withMessage('El campo Municipio no puede tener más de 45 caracteres'),

  check('Colonia')
    .optional()
    .isLength({ max: 45 }).withMessage('El campo Colonia no puede tener más de 45 caracteres'),

  check('Calle')
    .optional()
    .isLength({ max: 100 }).withMessage('El campo Calle no puede tener más de 100 caracteres'),

  check('EntreCalles')
    .optional()
    .isLength({ max: 45 }).withMessage('El campo EntreCalles no puede tener más de 45 caracteres'),

  check('NumeroExterior')
    .optional()
    .isLength({ max: 10 }).withMessage('El campo NumeroExterior no puede tener más de 10 caracteres'),

  check('NumeroInterior')
    .optional()
    .isLength({ max: 10 }).withMessage('El campo NumeroInterior no puede tener más de 10 caracteres'),

  check('CP')
    .optional()
    .isLength({ max: 5 }).withMessage('El código postal no puede tener más de 5 dígitos')
    .isNumeric().withMessage('El código postal debe contener solo números'),

  check('NombreEncargado')
    .optional()
    .isLength({ max: 100 }).withMessage('El campo NombreEncargado no puede tener más de 100 caracteres'),

  check('TelefonoEncargado')
    .optional()
    .isLength({ max: 10 }).withMessage('El teléfono del encargado no puede tener más de 10 dígitos')
    .isNumeric().withMessage('El teléfono del encargado debe contener solo números'),

  check('EmailEncargado')
    .optional()
    .isEmail().withMessage('Debe ser un correo electrónico válido para el encargado')
    .isLength({ max: 100 }).withMessage('El correo del encargado no puede tener más de 100 caracteres'),
];

module.exports = {
  validateClientCreation,
  validateClientUpdate,
};
