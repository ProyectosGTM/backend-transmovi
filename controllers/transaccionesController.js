// controllers/transaccionesController.js

const { Transacciones, Monederos, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');
const moment = require('moment-timezone');

// Crear una nueva transacción
const createTransaccion = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { IdMonedero, NumeroSerie, TipoTransaccion, Monto, Latitud, Longitud } = req.body;

    // Buscar el monedero
    let monedero = null;

    if (IdMonedero) {
      monedero = await Monederos.findByPk(IdMonedero);
    } else if (NumeroSerie) {
      monedero = await Monederos.findOne({ where: { NumeroSerie } });
    } else {
      await t.rollback();
      return res.status(400).json({ message: 'Debe especificar el IdMonedero o el NumeroSerie' });
    }

    if (!monedero) {
      await t.rollback();
      return res.status(404).json({ message: 'Monedero no encontrado' });
    }

    // Validar y actualizar saldo
    if (TipoTransaccion === 'Recarga') {
      monedero.Saldo = parseFloat(monedero.Saldo) + parseFloat(Monto);
    } else if (TipoTransaccion === 'Debito') {
      if (parseFloat(monedero.Saldo) < parseFloat(Monto)) {
        await t.rollback();
        return res.status(400).json({ message: 'Saldo insuficiente' });
      }
      monedero.Saldo = parseFloat(monedero.Saldo) - parseFloat(Monto);
    } else {
      await t.rollback();
      return res.status(400).json({ message: 'Tipo de transacción inválido' });
    }

    await monedero.save({ transaction: t });

    const fechaActual = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

    const newTransaccion = await Transacciones.create({
      IdMonedero: monedero.Id,
      TipoTransaccion,
      Monto,
      Latitud,
      Longitud,
      FechaHora: sequelize.literal(`'${fechaActual}'`),
      Estatus: 1,
    }, { transaction: t });

    await t.commit();

    await logToBitacora(
      'Transacciones',
      `Se creó una transacción de ${TipoTransaccion}`,
      'CREATE',
      `INSERT INTO Transacciones (IdMonedero, TipoTransaccion, Monto, Latitud, Longitud, FechaHora) VALUES (${monedero.Id}, '${TipoTransaccion}', ${Monto}, ${Latitud}, ${Longitud}, '${fechaActual}')`,
      req.user.id
    );

    const transaccionResponse = {
      ...newTransaccion.toJSON(),
      FechaHora: fechaActual
    };

    res.status(201).json({ message: 'Transacción registrada exitosamente', transaccion: transaccionResponse });
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

// Obtener todas las transacciones
const getAllTransacciones = async (req, res, next) => {
  try {
    const transacciones = await Transacciones.findAll({
      include: { model: Monederos, as: 'monedero' },
      order: [['FechaHora', 'DESC']],
    });
    if (transacciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron transacciones' });
    }

    res.status(200).json({ message: 'Transacciones obtenidas exitosamente', transacciones });
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

module.exports = { createTransaccion, getAllTransacciones };
