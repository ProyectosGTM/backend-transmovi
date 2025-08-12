// utils/bitacoraLogger.js

const { Bitacora } = require('../models');
const moment = require('moment-timezone');
const sequelize = require('../db'); // Importa la instancia de sequelize desde db.js

// Función para registrar una acción en la bitácora
const logToBitacora = async (modulo, descripcion, accion, query, idUsuario) => {
  try {
    // Ajustar manualmente la fecha a la zona horaria -06:00 y formatearla como cadena
    const fechaActual = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

    console.log(`Current Node.js timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
    console.log(`Fecha actual ajustada: ${fechaActual}`);
    
    // Insertar la fecha utilizando sequelize.literal para evitar la conversión
    const result = await Bitacora.create({
      Modulo: modulo,
      Descripcion: descripcion,
      Accion: accion,
      Query: query,
      Fecha: sequelize.literal(`'${fechaActual}'`), // Inserta la fecha directamente sin conversión
      IdUsuario: idUsuario
    });

    console.log('Registro insertado en Bitacora:', result.toJSON());
  } catch (error) {
    console.error('Error al registrar en la bitácora:', error);
  }
};

module.exports = { logToBitacora };
