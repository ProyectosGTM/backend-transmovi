// controllers/dispositivosController.js

const { Dispositivos, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Obtener todos los dispositivos
const getAllDispositivos = async (req, res, next) => {
  try {
    const dispositivos = await Dispositivos.findAll();
    if (dispositivos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron dispositivos' });
    }

    await logToBitacora('Dispositivos', 'Consulta de todos los dispositivos', 'READ', 'SELECT * FROM Dispositivos', req.user.id);
    res.status(200).json({ message: 'Dispositivos obtenidos exitosamente', dispositivos });
  } catch (error) {
    next(error);
  }
};

// Obtener un dispositivo por ID
const getDispositivoById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const dispositivo = await Dispositivos.findByPk(id);
    if (!dispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }

    await logToBitacora('Dispositivos', `Consulta del dispositivo con ID: ${id}`, 'READ', `SELECT * FROM Dispositivos WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Dispositivo obtenido exitosamente', dispositivo });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo dispositivo
const createDispositivo = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { NumeroSerie, Marca, Modelo, Estatus } = req.body;
    const newDispositivo = await Dispositivos.create(
      { NumeroSerie, Marca, Modelo, Estatus },
      { transaction: t }
    );

    await t.commit();
    await logToBitacora('Dispositivos', `Se creó el dispositivo con Número de Serie: ${NumeroSerie}`, 'CREATE', `INSERT INTO Dispositivos (NumeroSerie, Marca, Modelo, Estatus) VALUES ('${NumeroSerie}', '${Marca}', '${Modelo}', ${Estatus})`, req.user.id);

    res.status(201).json({ message: 'Dispositivo creado exitosamente', dispositivo: newDispositivo });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Actualizar un dispositivo existente
const updateDispositivo = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { NumeroSerie, Marca, Modelo, Estatus } = req.body;
    const dispositivo = await Dispositivos.findByPk(id);
    if (!dispositivo) {
      await t.rollback();
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }

    await dispositivo.update({ NumeroSerie, Marca, Modelo, Estatus }, { transaction: t });
    await t.commit();

    await logToBitacora('Dispositivos', `Se actualizó el dispositivo con ID: ${id}`, 'UPDATE', `UPDATE Dispositivos SET NumeroSerie='${NumeroSerie}', Marca='${Marca}', Modelo='${Modelo}', Estatus=${Estatus} WHERE Id=${id}`, req.user.id);

    res.status(200).json({ message: 'Dispositivo actualizado exitosamente', dispositivo });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Eliminar un dispositivo
const deleteDispositivo = async (req, res, next) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const dispositivo = await Dispositivos.findByPk(id);
    if (!dispositivo) {
      await t.rollback();
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }

    await dispositivo.destroy({ transaction: t });
    await t.commit();

    await logToBitacora('Dispositivos', `Se eliminó el dispositivo con ID: ${id}`, 'DELETE', `DELETE FROM Dispositivos WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Dispositivo eliminado exitosamente' });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

module.exports = {
  getAllDispositivos,
  getDispositivoById,
  createDispositivo,
  updateDispositivo,
  deleteDispositivo
};
