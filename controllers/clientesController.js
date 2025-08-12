// controllers/clientesController.js

const { Clientes, sequelize } = require('../models');
const { validationResult } = require('express-validator'); // Asumiendo que usarás express-validator en validaciones futuras
const { logToBitacora } = require('../utils/bitacoraLogger');

// Crear un nuevo cliente con manejo de transacciones
const createCliente = async (req, res, next) => {
  const t = await sequelize.transaction(); // Iniciar una transacción
  try {
    // Validación de los datos (si tienes express-validator configurado)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      IdPadre, RFC, TipoPersona, Estatus, Logotipo, Nombre, ApellidoPaterno,
      ApellidoMaterno, Telefono, Correo, Estado, Municipio, Colonia, Calle,
      EntreCalles, NumeroExterior, NumeroInterior, CP, NombreEncargado,
      TelefonoEncargado, EmailEncargado
    } = req.body;

    // Crear el nuevo cliente dentro de una transacción
    const newCliente = await Clientes.create({
      IdPadre, RFC, TipoPersona, Estatus, Logotipo, Nombre, ApellidoPaterno,
      ApellidoMaterno, Telefono, Correo, Estado, Municipio, Colonia, Calle,
      EntreCalles, NumeroExterior, NumeroInterior, CP, NombreEncargado,
      TelefonoEncargado, EmailEncargado
    }, { transaction: t });

    await t.commit(); // Confirmar la transacción

    // Registrar en la bitácora
    await logToBitacora(
      'Clientes', 
      `Se creó el cliente: ${Nombre}`, 
      'CREATE', 
      `INSERT INTO Clientes (...) VALUES (...)`, 
      req.user.id
    );

    res.status(201).json({ message: 'Cliente creado exitosamente', cliente: newCliente });
  } catch (error) {
    await t.rollback(); // Deshacer la transacción en caso de error
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Obtener todos los clientes
const getAllClientes = async (req, res, next) => {
  try {
    const clientes = await Clientes.findAll();

    // Registrar en la bitácora
    await logToBitacora(
      'Clientes', 
      'Se consultaron todos los clientes', 
      'READ', 
      'SELECT * FROM Clientes', 
      req.user.id
    );

    res.status(200).json(clientes);
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Obtener un cliente por ID
const getClienteById = async (req, res, next) => {
  try {
    const cliente = await Clientes.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Registrar en la bitácora
    await logToBitacora(
      'Clientes', 
      `Se consultó el cliente con ID: ${req.params.id}`, 
      'READ', 
      `SELECT * FROM Clientes WHERE Id=${req.params.id}`, 
      req.user.id
    );

    res.status(200).json(cliente);
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Actualizar un cliente existente con validación y transacción
const updateCliente = async (req, res, next) => {
  const t = await sequelize.transaction(); // Iniciar una transacción
  try {
    // Verificar los errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      IdPadre, RFC, TipoPersona, Estatus, Logotipo, Nombre, ApellidoPaterno,
      ApellidoMaterno, Telefono, Correo, Estado, Municipio, Colonia, Calle,
      EntreCalles, NumeroExterior, NumeroInterior, CP, NombreEncargado,
      TelefonoEncargado, EmailEncargado
    } = req.body;

    const cliente = await Clientes.findByPk(req.params.id);
    
    if (!cliente) {
      await t.rollback();
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Actualizar el cliente dentro de una transacción
    await cliente.update({
      IdPadre, RFC, TipoPersona, Estatus, Logotipo, Nombre, ApellidoPaterno,
      ApellidoMaterno, Telefono, Correo, Estado, Municipio, Colonia, Calle,
      EntreCalles, NumeroExterior, NumeroInterior, CP, NombreEncargado,
      TelefonoEncargado, EmailEncargado
    }, { transaction: t });

    await t.commit(); // Confirmar la transacción

    // Registrar en la bitácora
    await logToBitacora(
      'Clientes', 
      `Se actualizó el cliente con ID: ${req.params.id}`, 
      'UPDATE', 
      `UPDATE Clientes SET ... WHERE Id=${req.params.id}`, 
      req.user.id
    );

    res.status(200).json({ message: 'Cliente actualizado exitosamente', cliente });
  } catch (error) {
    await t.rollback(); // Deshacer la transacción en caso de error
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Eliminar un cliente
const deleteCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    await cliente.destroy();

    // Registrar en la bitácora
    await logToBitacora(
      'Clientes', 
      `Se eliminó el cliente con ID: ${req.params.id}`, 
      'DELETE', 
      `DELETE FROM Clientes WHERE Id=${req.params.id}`, 
      req.user.id
    );

    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

module.exports = {
  createCliente,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
};
