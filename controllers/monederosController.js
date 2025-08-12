// controllers/monederosController.js

const { Monederos, Transacciones, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Obtener todos los monederos
const getAllMonederos = async (req, res, next) => {
  try {
    const monederos = await Monederos.findAll();
    if (monederos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron monederos' });
    }

    await logToBitacora('Monederos', 'Consulta de todos los monederos', 'READ', 'SELECT * FROM Monederos', req.user.id);
    res.status(200).json({ message: 'Monederos obtenidos exitosamente', monederos });
  } catch (error) {
    next(error);
  }
};

// Obtener un monedero por ID
const getMonederoById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const monedero = await Monederos.findByPk(id);
    if (!monedero) {
      return res.status(404).json({ message: 'Monedero no encontrado' });
    }

    await logToBitacora('Monederos', `Consulta del monedero con ID: ${id}`, 'READ', `SELECT * FROM Monederos WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Monedero obtenido exitosamente', monedero });
  } catch (error) {
    next(error);
  }
};

// Obtener un monedero por Número de Serie
const getMonederoByNumeroSerie = async (req, res, next) => {
  const { numeroSerie } = req.params;
  try {
    const monedero = await Monederos.findOne({ where: { NumeroSerie: numeroSerie } });
    if (!monedero) {
      return res.status(404).json({ message: 'Monedero no encontrado' });
    }

    await logToBitacora(
      'Monederos',
      `Consulta del monedero con Número de Serie: ${numeroSerie}`,
      'READ',
      `SELECT * FROM Monederos WHERE NumeroSerie='${numeroSerie}'`,
      req.user.id
    );

    res.status(200).json({ message: 'Monedero obtenido exitosamente', monedero });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo monedero
const createMonedero = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { NumeroSerie, FechaActivacion, Saldo, Estatus } = req.body;

    const newMonedero = await Monederos.create(
      { NumeroSerie, FechaActivacion, Saldo, Estatus },
      { transaction: t }
    );

    await t.commit();
    await logToBitacora('Monederos', `Se creó el monedero con número de serie: ${NumeroSerie}`, 'CREATE', `INSERT INTO Monederos (NumeroSerie, FechaActivacion, Saldo, Estatus) VALUES ('${NumeroSerie}', '${FechaActivacion}', ${Saldo}, ${Estatus})`, req.user.id);

    res.status(201).json({ message: 'Monedero creado exitosamente', monedero: newMonedero });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Actualizar un monedero existente
const updateMonedero = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { NumeroSerie, FechaActivacion, Saldo, Estatus } = req.body;
    const monedero = await Monederos.findByPk(id);
    if (!monedero) {
      await t.rollback();
      return res.status(404).json({ message: 'Monedero no encontrado' });
    }

    await monedero.update({ NumeroSerie, FechaActivacion, Saldo, Estatus }, { transaction: t });
    await t.commit();

    await logToBitacora('Monederos', `Se actualizó el monedero con ID: ${id}`, 'UPDATE', `UPDATE Monederos SET NumeroSerie='${NumeroSerie}', FechaActivacion='${FechaActivacion}', Saldo=${Saldo}, Estatus=${Estatus} WHERE Id=${id}`, req.user.id);

    res.status(200).json({ message: 'Monedero actualizado exitosamente', monedero });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Eliminar un monedero
const deleteMonedero = async (req, res, next) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const monedero = await Monederos.findByPk(id);
    if (!monedero) {
      await t.rollback();
      return res.status(404).json({ message: 'Monedero no encontrado' });
    }

    await monedero.destroy({ transaction: t });
    await t.commit();

    await logToBitacora('Monederos', `Se eliminó el monedero con ID: ${id}`, 'DELETE', `DELETE FROM Monederos WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Monedero eliminado exitosamente' });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

module.exports = {
  getAllMonederos,
  getMonederoById,
  getMonederoByNumeroSerie,
  createMonedero,
  updateMonedero,
  deleteMonedero,
};
