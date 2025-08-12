// controllers/pasajerosController.js

const { Pasajeros, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Obtener todos los pasajeros
const getAllPasajeros = async (req, res, next) => {
  try {
    const pasajeros = await Pasajeros.findAll();
    if (pasajeros.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pasajeros' });
    }
    await logToBitacora('Pasajeros', 'Se consultaron todos los pasajeros', 'READ', 'SELECT * FROM Pasajeros', req.user.id);
    res.status(200).json({ message: 'Pasajeros obtenidos exitosamente', pasajeros });
  } catch (error) {
    next(error);
  }
};

// Obtener un pasajero por ID
const getPasajeroById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const pasajero = await Pasajeros.findByPk(id);
    if (!pasajero) {
      return res.status(404).json({ message: 'Pasajero no encontrado' });
    }
    await logToBitacora('Pasajeros', `Se consultó el pasajero con ID: ${id}`, 'READ', `SELECT * FROM Pasajeros WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Pasajero obtenido exitosamente', pasajero });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo pasajero
const createPasajero = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento, Correo, Telefono, Estatus } = req.body;

    const newPasajero = await Pasajeros.create({
      Nombre,
      ApellidoPaterno,
      ApellidoMaterno,
      FechaNacimiento,
      Correo,
      Telefono,
      Estatus: Estatus || 1
    }, { transaction: t });

    await t.commit();
    await logToBitacora('Pasajeros', `Se creó el pasajero: ${Nombre}`, 'CREATE', `INSERT INTO Pasajeros (...)`, req.user.id);
    res.status(201).json({ message: 'Pasajero creado exitosamente', newPasajero });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Actualizar un pasajero
const updatePasajero = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { id } = req.params;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const pasajero = await Pasajeros.findByPk(id);
    if (!pasajero) {
      await t.rollback();
      return res.status(404).json({ message: 'Pasajero no encontrado' });
    }

    const { Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento, Correo, Telefono, Estatus } = req.body;

    pasajero.Nombre = Nombre || pasajero.Nombre;
    pasajero.ApellidoPaterno = ApellidoPaterno || pasajero.ApellidoPaterno;
    pasajero.ApellidoMaterno = ApellidoMaterno || pasajero.ApellidoMaterno;
    pasajero.FechaNacimiento = FechaNacimiento || pasajero.FechaNacimiento;
    pasajero.Correo = Correo || pasajero.Correo;
    pasajero.Telefono = Telefono || pasajero.Telefono;
    pasajero.Estatus = Estatus !== undefined ? Estatus : pasajero.Estatus;

    await pasajero.save({ transaction: t });
    await t.commit();
    await logToBitacora('Pasajeros', `Se actualizó el pasajero con ID: ${id}`, 'UPDATE', `UPDATE Pasajeros SET ... WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Pasajero actualizado exitosamente', pasajero });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Eliminar un pasajero
const deletePasajero = async (req, res, next) => {
  const { id } = req.params;
  try {
    const pasajero = await Pasajeros.findByPk(id);
    if (!pasajero) {
      return res.status(404).json({ message: 'Pasajero no encontrado' });
    }

    await pasajero.destroy();
    await logToBitacora('Pasajeros', `Se eliminó el pasajero con ID: ${id}`, 'DELETE', `DELETE FROM Pasajeros WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Pasajero eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPasajeros,
  getPasajeroById,
  createPasajero,
  updatePasajero,
  deletePasajero
};
