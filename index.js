// index.js

require('dotenv').config();
const app = require('./app');
const sequelize = require('./db'); // Asegúrate de que esta ruta sea correcta

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Autenticar la conexión
    await sequelize.authenticate();
    console.log('Conexión a la base de datos autenticada con éxito.');

    // Sincronizar la base de datos
    await sequelize.sync();
    console.log('Conexión a la base de datos establecida con éxito.');

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT} en modo ${process.env.NODE_ENV || 'desarrollo'}`);
    });
  } catch (error) {
    console.error('Error al autenticar, sincronizar la base de datos o iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejar señales de cierre
process.on('SIGINT', async () => {
  console.log('Cerrando servidor y desconectando la base de datos...');
  await sequelize.close();
  process.exit(0);
});

startServer();
