// controllers/operadoresController.js

const { Operadores, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Obtener todos los operadores
const getAllOperadores = async (req, res, next) => {
  try {
    const operadores = await Operadores.findAll();
    if (operadores.length === 0) {
      return res.status(404).json({ message: 'No se encontraron operadores' });
    }

    await logToBitacora('Operadores', 'Consulta de todos los operadores', 'READ', 'SELECT * FROM Operadores', req.user.id);
    res.status(200).json({ message: 'Operadores obtenidos exitosamente', operadores });
  } catch (error) {
    next(error);
  }
};

// Obtener un operador por ID
const getOperadorById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const operador = await Operadores.findByPk(id);
    if (!operador) {
      return res.status(404).json({ message: 'Operador no encontrado' });
    }

    await logToBitacora('Operadores', `Consulta del operador con ID: ${id}`, 'READ', `SELECT * FROM Operadores WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Operador obtenido exitosamente', operador });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo operador
const createOperador = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { Nombre, ApellidoPaterno, ApellidoMaterno, NumeroLicencia, FechaNacimiento, Correo, Telefono, Estatus } = req.body;
    const newOperador = await Operadores.create(
      { Nombre, ApellidoPaterno, ApellidoMaterno, NumeroLicencia, FechaNacimiento, Correo, Telefono, Estatus },
      { transaction: t }
    );

    await t.commit();
    await logToBitacora('Operadores', `Se creó el operador: ${Nombre} ${ApellidoPaterno}`, 'CREATE', `INSERT INTO Operadores (Nombre, ApellidoPaterno, ApellidoMaterno, NumeroLicencia, FechaNacimiento, Correo, Telefono, Estatus) VALUES ('${Nombre}', '${ApellidoPaterno}', '${ApellidoMaterno}', '${NumeroLicencia}', '${FechaNacimiento}', '${Correo}', '${Telefono}', ${Estatus})`, req.user.id);

    res.status(201).json({ message: 'Operador creado exitosamente', operador: newOperador });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Actualizar un operador existente
const updateOperador = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { Nombre, ApellidoPaterno, ApellidoMaterno, NumeroLicencia, FechaNacimiento, Correo, Telefono, Estatus } = req.body;
    const operador = await Operadores.findByPk(id);
    if (!operador) {
      await t.rollback();
      return res.status(404).json({ message: 'Operador no encontrado' });
    }

    await operador.update({ Nombre, ApellidoPaterno, ApellidoMaterno, NumeroLicencia, FechaNacimiento, Correo, Telefono, Estatus }, { transaction: t });
    await t.commit();

    await logToBitacora('Operadores', `Se actualizó el operador con ID: ${id}`, 'UPDATE', `UPDATE Operadores SET Nombre='${Nombre}', ApellidoPaterno='${ApellidoPaterno}', ApellidoMaterno='${ApellidoMaterno}', NumeroLicencia='${NumeroLicencia}', FechaNacimiento='${FechaNacimiento}', Correo='${Correo}', Telefono='${Telefono}', Estatus=${Estatus} WHERE Id=${id}`, req.user.id);

    res.status(200).json({ message: 'Operador actualizado exitosamente', operador });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Eliminar un operador
const deleteOperador = async (req, res, next) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const operador = await Operadores.findByPk(id);
    if (!operador) {
      await t.rollback();
      return res.status(404).json({ message: 'Operador no encontrado' });
    }

    await operador.destroy({ transaction: t });
    await t.commit();

    await logToBitacora('Operadores', `Se eliminó el operador con ID: ${id}`, 'DELETE', `DELETE FROM Operadores WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Operador eliminado exitosamente' });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

module.exports = {
  getAllOperadores,
  getOperadorById,
  createOperador,
  updateOperador,
  deleteOperador
};
