// db.js

const { Sequelize } = require('sequelize');
require('dotenv').config(); // Cargar variables de entorno

console.log('Connecting to MySQL with the following settings:');
console.log({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Verificar si la URL de la base de datos está definida
if (!process.env.DATABASE_URL) {
  console.error('ERROR: La variable DATABASE_URL no está definida en el archivo .env');
  process.exit(1); // Detener el proceso si no está configurada la conexión
}

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },
  timezone: '-06:00', // Ajusta la zona horaria para Sequelize
  define: {
    timestamps: false,
  },
});

// Manejar la conexión a la base de datos
sequelize.authenticate()
  .then(async () => {
    console.log('Conexión a la base de datos exitosa.');

    // Configurar la zona horaria de la sesión después de conectar
    const [results, metadata] = await sequelize.query("SET time_zone = '-06:00';");
    console.log('Resultado de ajustar la zona horaria de la sesión:', metadata);
    console.log('Zona horaria de la sesión ajustada a -06:00');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Detener el proceso en caso de error
  });

module.exports = sequelize;
