// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const { Usuarios, Roles, Permisos } = require('../models');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  // Verificar si el token está presente
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado, autorización denegada.' });
  }

  try {
    // Extraer solo el token si viene en formato "Bearer <token>"
    const formattedToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    // Verificar el token
    const decoded = jwt.verify(formattedToken, process.env.JWT_SECRET);
    req.user = decoded; // Asignar el payload decodificado del JWT a req.user
    next();
  } catch (error) {
    // Capturar errores específicos de la verificación de token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'El token ha expirado, por favor inicie sesión nuevamente.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido, autorización denegada.' });
    } else {
      return res.status(500).json({ message: 'Error en la verificación del token.', error: error.message });
    }
  }
};

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      // Obtener el usuario y sus roles/permisos desde la base de datos
      const user = await Usuarios.findByPk(req.user.id, {
        include: {
          model: Roles,
          as: 'rol',
          include: {
            model: Permisos,
            through: 'RolePermisos',
            as: 'permisos',
          },
        },
      });

      // Verificar si el usuario tiene el rol requerido
      if (!user || !roles.includes(user.rol.Nombre)) {
        return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para esta acción.' });
      }

      // Verificación adicional para el rol 'admin' que tiene acceso a todo
      if (user.rol.Nombre === 'admin') {
        return next(); // Permitir acceso completo
      }

      // Validar que el usuario tenga permisos específicos si aplica
      const permisosNecesarios = roles.map((rol) => `PERMISO_VER_${rol.toUpperCase()}`);
      const permisosUsuario = user.rol.permisos.map((permiso) => permiso.Nombre);

      // Verificar si el usuario tiene al menos uno de los permisos necesarios
      const tienePermiso = permisosNecesarios.some((permiso) => permisosUsuario.includes(permiso));

      if (!tienePermiso) {
        return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para esta acción.' });
      }

      next(); // Continuar si tiene los permisos correctos
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { verifyToken, checkRole };
