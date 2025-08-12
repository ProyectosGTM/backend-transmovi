// controllers/vehiculosController.js

const { Vehiculos, Operadores, Dispositivos, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Obtener todos los vehículos
const getAllVehiculos = async (req, res, next) => {
  try {
    const vehiculos = await Vehiculos.findAll({ include: ['operador', 'dispositivo'] });
    if (vehiculos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron vehículos' });
    }

    await logToBitacora('Vehiculos', 'Consulta de todos los vehículos', 'READ', 'SELECT * FROM Vehiculos', req.user.id);
    res.status(200).json({ message: 'Vehículos obtenidos exitosamente', vehiculos });
  } catch (error) {
    next(error);
  }
};

// Obtener un vehículo por ID
const getVehiculoById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const vehiculo = await Vehiculos.findByPk(id, { include: ['operador', 'dispositivo'] });
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    await logToBitacora('Vehiculos', `Consulta del vehículo con ID: ${id}`, 'READ', `SELECT * FROM Vehiculos WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Vehículo obtenido exitosamente', vehiculo });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo vehículo
const createVehiculo = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { Marca, Modelo, Ano, Placa, NumeroEconomico, Estatus, IdOperador, IdDispositivo } = req.body;
    
    const newVehiculo = await Vehiculos.create(
      { Marca, Modelo, Ano, Placa, NumeroEconomico, Estatus, IdOperador, IdDispositivo },
      { transaction: t }
    );

    await t.commit();
    await logToBitacora('Vehiculos', `Se creó el vehículo: ${Marca} ${Modelo}`, 'CREATE', `INSERT INTO Vehiculos (Marca, Modelo, Ano, Placa, NumeroEconomico, Estatus, IdOperador, IdDispositivo) VALUES ('${Marca}', '${Modelo}', ${Ano}, '${Placa}', '${NumeroEconomico}', ${Estatus}, ${IdOperador}, ${IdDispositivo})`, req.user.id);

    res.status(201).json({ message: 'Vehículo creado exitosamente', vehiculo: newVehiculo });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Actualizar un vehículo existente
const updateVehiculo = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { Marca, Modelo, Ano, Placa, NumeroEconomico, Estatus, IdOperador, IdDispositivo } = req.body;
    const vehiculo = await Vehiculos.findByPk(id);
    if (!vehiculo) {
      await t.rollback();
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    await vehiculo.update({ Marca, Modelo, Ano, Placa, NumeroEconomico, Estatus, IdOperador, IdDispositivo }, { transaction: t });
    await t.commit();

    await logToBitacora('Vehiculos', `Se actualizó el vehículo con ID: ${id}`, 'UPDATE', `UPDATE Vehiculos SET Marca='${Marca}', Modelo='${Modelo}', Ano=${Ano}, Placa='${Placa}', NumeroEconomico='${NumeroEconomico}', Estatus=${Estatus}, IdOperador=${IdOperador}, IdDispositivo=${IdDispositivo} WHERE Id=${id}`, req.user.id);

    res.status(200).json({ message: 'Vehículo actualizado exitosamente', vehiculo });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};
//apartado agregado
//cambiar el Estatus
const changeVehiculoEstatus = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { Estatus } = req.body;  // esperamos 0 aquí

    const vehiculo = await Vehiculos.findByPk(id);
    if (!vehiculo) {
      await t.rollback();
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    await vehiculo.update({ Estatus }, { transaction: t }); //agregamos los datos a la base de datos
    await t.commit();

                              //generamos una bitacora
    await logToBitacora('Vehiculos',`Se cambió el estatus a ${Estatus} del vehículo con ID: ${id}`,'UPDATE',`UPDATE Vehiculos SET Estatus=${Estatus} WHERE Id=${id}`,req.user.id);

    res.status(200).json({ message: `Estatus actualizado a ${Estatus} exitosamente`, vehiculo });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Eliminar un vehículo
const deleteVehiculo = async (req, res, next) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const vehiculo = await Vehiculos.findByPk(id);
    if (!vehiculo) {
      await t.rollback();
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    await vehiculo.destroy({ transaction: t });
    await t.commit();

    await logToBitacora('Vehiculos', `Se eliminó el vehículo con ID: ${id}`, 'DELETE', `DELETE FROM Vehiculos WHERE Id=${id}`, req.user.id);
    res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

module.exports = {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  changeVehiculoEstatus,
  deleteVehiculo
};
