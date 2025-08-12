// controllers/permisosController.js

const { Permisos, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Crear un nuevo permiso con manejo de transacciones
const createPermiso = async (req, res, next) => {
  const t = await sequelize.transaction(); // Iniciar una transacción
  try {
    // Validación de los datos (usando express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, descripcion } = req.body;

    // Crear el permiso dentro de una transacción
    const newPermiso = await Permisos.create(
      {
        Nombre: nombre,
        Descripcion: descripcion || null, // Permitir descripción opcional
      },
      { transaction: t }
    );

    await t.commit(); // Confirmar la transacción

    // Registrar en la bitácora la creación del permiso
    await logToBitacora(
      'Permisos',
      `Se creó el permiso: ${nombre}`,
      'CREATE',
      `INSERT INTO Permisos (Nombre, Descripcion) VALUES ('${nombre}', '${descripcion}')`,
      req.user.id
    );

    res.status(201).json({ message: 'Permiso creado exitosamente', permiso: newPermiso });
  } catch (error) {
    await t.rollback(); // Deshacer la transacción en caso de error
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Obtener todos los permisos
const getAllPermisos = async (req, res, next) => {
  try {
    const permisos = await Permisos.findAll();

    if (permisos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron permisos' });
    }

    // Registrar en la bitácora la consulta de permisos
    await logToBitacora(
      'Permisos',
      'Se consultaron todos los permisos',
      'READ',
      'SELECT * FROM Permisos',
      req.user.id
    );

    res.status(200).json({ message: 'Permisos obtenidos exitosamente', permisos });
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

module.exports = { createPermiso, getAllPermisos };
