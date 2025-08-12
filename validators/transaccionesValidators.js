// validators/transaccionesValidators.js

const { check, body } = require('express-validator');

const validateTransaccionCreation = [
  body().custom(body => {
    if (!body.IdMonedero && !body.NumeroSerie) {
      throw new Error('Debe proporcionar el IdMonedero o el NumeroSerie');
    }
    return true;
  }),
  check('TipoTransaccion').isIn(['Recarga', 'Debito']).withMessage('Tipo de transacción inválido'),
  check('Monto').isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0'),
  check('Latitud').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
  check('Longitud').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida'),
];

module.exports = {
  validateTransaccionCreation,
};
