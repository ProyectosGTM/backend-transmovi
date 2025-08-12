// controllers/rolesController.js

const { Roles, Permisos, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Obtener todos los roles
const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Roles.findAll({ include: Permisos });
    if (roles.length === 0) {
      return res.status(404).json({ message: 'No se encontraron roles' });
    }

    // Registrar en la bitácora la consulta de roles
    await logToBitacora(
      'Roles',
      'Se consultaron todos los roles',
      'READ',
      'SELECT * FROM Roles',
      req.user.id
    );

    res.status(200).json({ message: 'Roles obtenidos exitosamente', roles });
  } catch (error) {
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Crear un nuevo rol con manejo de permisos, evitando duplicados
const createRole = async (req, res, next) => {
  const t = await sequelize.transaction(); // Iniciar una transacción
  try {
    // Validación de los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback(); // Si hay errores, deshacer la transacción
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, descripcion, permisosIds } = req.body;

    // Crear el nuevo rol dentro de una transacción
    const newRole = await Roles.create(
      {
        Nombre: nombre,
        Descripcion: descripcion,
      },
      { transaction: t }
    );

    // Asignar permisos al rol si existen
    if (permisosIds && permisosIds.length > 0) {
      // Validar reglas de negocio: no permitir más de X permisos
      const MAX_PERMISOS = 10; // Ejemplo de regla de negocio
      if (permisosIds.length > MAX_PERMISOS) {
        await t.rollback();
        return res.status(400).json({ message: `No se pueden asignar más de ${MAX_PERMISOS} permisos a un rol.` });
      }

      // Asignar los permisos al rol
      const permisos = await Permisos.findAll({
        where: { Id: permisosIds },
        transaction: t,
      });
      await newRole.setPermisos(permisos, { transaction: t });
    }

    await t.commit(); // Confirmar la transacción si todo salió bien

    // Registrar en la bitácora la creación del rol
    await logToBitacora(
      'Roles',
      `Se creó el rol: ${nombre}`,
      'CREATE',
      `INSERT INTO Roles (Nombre, Descripcion) VALUES ('${nombre}', '${descripcion}')`,
      req.user.id
    );

    res.status(201).json({ message: 'Rol creado exitosamente', role: newRole });
  } catch (error) {
    await t.rollback(); // Deshacer la transacción en caso de error
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

// Actualizar un rol existente con manejo de permisos, evitando duplicados
const updateRole = async (req, res, next) => {
  const t = await sequelize.transaction(); // Iniciar una transacción
  try {
    const { id } = req.params;
    const { nombre, descripcion, permisosIds } = req.body;

    // Validación de los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback(); // Si hay errores, deshacer la transacción
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar si el rol existe
    const role = await Roles.findByPk(id, { transaction: t });
    if (!role) {
      await t.rollback();
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    // Actualizar los datos del rol
    role.Nombre = nombre || role.Nombre;
    role.Descripcion = descripcion || role.Descripcion;
    await role.save({ transaction: t });

    // Manejar la asignación de permisos si se proporcionan
    if (permisosIds && permisosIds.length > 0) {
      // Validar reglas de negocio: no permitir más de X permisos
      const MAX_PERMISOS = 10; // Ejemplo de regla de negocio
      if (permisosIds.length > MAX_PERMISOS) {
        await t.rollback();
        return res.status(400).json({ message: `No se pueden asignar más de ${MAX_PERMISOS} permisos a un rol.` });
      }

      // Asignar los permisos al rol
      const permisos = await Permisos.findAll({
        where: { Id: permisosIds },
        transaction: t,
      });
      await role.setPermisos(permisos, { transaction: t });
    }

    await t.commit(); // Confirmar la transacción si todo salió bien

    // Registrar en la bitácora la actualización del rol
    await logToBitacora(
      'Roles',
      `Se actualizó el rol con ID: ${id}`,
      'UPDATE',
      `UPDATE Roles SET Nombre='${nombre}', Descripcion='${descripcion}' WHERE Id=${id}`,
      req.user.id
    );

    res.status(200).json({ message: 'Rol actualizado exitosamente', role });
  } catch (error) {
    await t.rollback(); // Deshacer la transacción en caso de error
    next(error); // Delegar el error al middleware de manejo de errores
  }
};

module.exports = {
  getAllRoles,
  createRole,
  updateRole,
};
