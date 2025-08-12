// controllers/modulosController.js

const { Modulos, Permisos, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Crear un nuevo módulo
const createModulo = async (req, res, next) => {
  try {
    const { Nombre, Descripcion } = req.body;

    const newModulo = await Modulos.create({ Nombre, Descripcion });

    // Registrar en la bitácora la creación del módulo
    await logToBitacora(
      'Modulos',
      `Se creó el módulo: ${Nombre}`,
      'CREATE',
      `INSERT INTO Modulos (Nombre, Descripcion) VALUES ('${Nombre}', '${Descripcion}')`,
      req.user.id
    );

    res.status(201).json({ message: 'Módulo creado exitosamente', modulo: newModulo });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los módulos
const getAllModulos = async (req, res, next) => {
  try {
    const modulos = await Modulos.findAll();

    // Registrar en la bitácora la consulta de todos los módulos
    await logToBitacora(
      'Modulos',
      'Se consultaron todos los módulos',
      'READ',
      'SELECT * FROM Modulos',
      req.user.id
    );

    res.status(200).json(modulos);
  } catch (error) {
    next(error);
  }
};

// Asignar permisos a un módulo
const assignPermisosToModulo = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params; // ID del módulo
    const { permisosIds } = req.body; // Array de permisos a asignar

    const modulo = await Modulos.findByPk(id);
    if (!modulo) {
      await t.rollback();
      return res.status(404).json({ message: 'Módulo no encontrado' });
    }

    // Asignar permisos al módulo
    const permisos = await Permisos.findAll({ where: { Id: permisosIds } });
    await modulo.setPermisos(permisos, { transaction: t });

    await t.commit();

    // Registrar en la bitácora la asignación de permisos
    await logToBitacora(
      'Modulos',
      `Se asignaron permisos al módulo con ID: ${id}`,
      'UPDATE',
      `UPDATE Modulos SET Permisos=[${permisosIds.join(', ')}] WHERE Id=${id}`,
      req.user.id
    );

    res.status(200).json({ message: 'Permisos asignados al módulo exitosamente' });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

module.exports = {
  createModulo,
  getAllModulos,
  assignPermisosToModulo
};
