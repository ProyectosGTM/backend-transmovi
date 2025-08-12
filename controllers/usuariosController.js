// controllers/usuariosController.js

const { Usuarios, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Obtener todos los usuarios
const getAllUsuarios = async (req, res, next) => {
  try {
    const users = await Usuarios.findAll();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios' });
    }

    // Registrar en la bitácora la consulta de todos los usuarios
    const usuarioBitacora = req.user ? req.user.id : 'system';
    await logToBitacora(
      'Usuarios',
      'Se consultaron todos los usuarios',
      'READ',
      'SELECT * FROM Usuarios',
      usuarioBitacora
    );

    res.status(200).json({ message: 'Usuarios obtenidos exitosamente', users });
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Obtener un usuario por ID
const getUsuariosById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Usuarios.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Registrar en la bitácora la consulta de un usuario por ID
    const usuarioBitacora = req.user ? req.user.id : 'system';
    await logToBitacora(
      'Usuarios',
      `Se consultó el usuario con ID: ${id}`,
      'READ',
      `SELECT * FROM Usuarios WHERE Id=${id}`,
      usuarioBitacora
    );

    res.status(200).json({ message: 'Usuario obtenido exitosamente', user });
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Crear un nuevo usuario con transacción y validación de entradas
const createUsuarios = async (req, res, next) => {
  const t = await sequelize.transaction(); // Iniciar una transacción
  try {
    // Verificar los errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      UserName,
      Password,
      Telefono,
      Nombre,
      ApellidoPaterno,
      ApellidoMaterno,
      EmailConfirmed,
      Estatus,
      IdRol,
      IdCliente
    } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await Usuarios.findOne({ where: { UserName } });
    if (userExists) {
      await t.rollback();
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Crear el nuevo usuario dentro de una transacción
    const newUser = await Usuarios.create(
      {
        UserName,
        Password: hashedPassword,
        Telefono,
        Nombre,
        ApellidoPaterno,
        ApellidoMaterno,
        EmailConfirmed: EmailConfirmed || 0, // Confirmación de correo predeterminada
        Estatus: Estatus || 1, // Estatus predeterminado como activo
        IdRol,
        IdCliente
      },
      { transaction: t }
    );

    await t.commit(); // Confirmar la transacción

    // Si req.user no está disponible, utilizar un valor predeterminado para IdUsuario (ej. 0 para el sistema)
    const usuarioBitacora = req.user ? req.user.id : 0; // Utilizar 0 como valor para 'system'

    // Registrar en la bitácora la creación del usuario
    await logToBitacora(
      'Usuarios',
      `Se creó el usuario: ${UserName}`,
      'CREATE',
      `INSERT INTO Usuarios (UserName, Telefono, Nombre, ApellidoPaterno, ApellidoMaterno, EmailConfirmed, Estatus, IdRol, IdCliente) VALUES ('${UserName}', '${Telefono}', '${Nombre}', '${ApellidoPaterno}', '${ApellidoMaterno}', ${EmailConfirmed}, ${Estatus}, ${IdRol}, ${IdCliente})`,
      usuarioBitacora // Aquí se inserta el 0 o el ID real del usuario
    );

    res.status(201).json({ message: 'Usuario creado exitosamente', newUser });
  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Actualizar un usuario existente con validación y transacción
const updateUsuarios = async (req, res, next) => {
  const t = await sequelize.transaction(); // Iniciar una transacción
  const { id } = req.params;
  const {
    UserName,
    Password,
    Telefono,
    Nombre,
    ApellidoPaterno,
    ApellidoMaterno,
    Estatus,
    IdRol,
    IdCliente
  } = req.body;

  try {
    // Verificar los errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await Usuarios.findByPk(id);
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si se proporciona una nueva contraseña, encriptarla
    if (Password) {
      user.Password = await bcrypt.hash(Password, 10);
    }

    // Actualizar los campos del usuario dentro de una transacción
    user.UserName = UserName || user.UserName;
    user.Telefono = Telefono || user.Telefono;
    user.Nombre = Nombre || user.Nombre;
    user.ApellidoPaterno = ApellidoPaterno || user.ApellidoPaterno;
    user.ApellidoMaterno = ApellidoMaterno || user.ApellidoMaterno;
    user.Estatus = Estatus !== undefined ? Estatus : user.Estatus;
    user.IdRol = IdRol || user.IdRol;
    user.IdCliente = IdCliente || user.IdCliente;

    await user.save({ transaction: t });

    await t.commit(); // Confirmar la transacción

    // Registrar en la bitácora la actualización del usuario
    const usuarioBitacora = req.user ? req.user.id : 'system';
    await logToBitacora(
      'Usuarios',
      `Se actualizó el usuario con ID: ${id}`,
      'UPDATE',
      `UPDATE Usuarios SET UserName='${UserName}', Telefono='${Telefono}', Nombre='${Nombre}', ApellidoPaterno='${ApellidoPaterno}', ApellidoMaterno='${ApellidoMaterno}', Estatus=${Estatus}, IdRol=${IdRol}, IdCliente=${IdCliente} WHERE Id=${id}`,
      usuarioBitacora
    );

    res.status(200).json({ message: 'Usuario actualizado exitosamente', user });
  } catch (error) {
    await t.rollback(); // Deshacer la transacción en caso de error
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Eliminar un usuario
const deleteUsuarios = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Usuarios.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();

    // Registrar en la bitácora la eliminación del usuario
    const usuarioBitacora = req.user ? req.user.id : 'system';
    await logToBitacora(
      'Usuarios',
      `Se eliminó el usuario con ID: ${id}`,
      'DELETE',
      `DELETE FROM Usuarios WHERE Id=${id}`,
      usuarioBitacora
    );

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

module.exports = {
  getAllUsuarios,
  getUsuariosById,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios
};
