// utils/generateJWT.js

const jwt = require('jsonwebtoken');

const generateJWT = (payload, expiresIn = process.env.JWT_EXPIRES_IN) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expiresIn || '1h', // Valor por defecto si no se especifica
      algorithm: 'HS256' // Establecemos el algoritmo para mayor seguridad
    });
    return token;
  } catch (error) {
    console.error('Error al generar el token JWT:', error);
    throw new Error('Error al generar el token');
  }
};

module.exports = { generateJWT };
