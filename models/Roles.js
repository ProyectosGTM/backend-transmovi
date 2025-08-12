// models/Roles.js

module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    Id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del rol no puede estar vacío'
        },
        len: {
          args: [1, 100],
          msg: 'El nombre del rol debe tener entre 1 y 100 caracteres'
        }
      }
    },
    Descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'La descripción no puede tener más de 255 caracteres'
        }
      }
    }
  }, {
    timestamps: false, // Se activa timestamps para manejar `createdAt` y `updatedAt`
    tableName: 'Roles' // Nombre explícito de la tabla
  });

  // Asociaciones de muchos a muchos con Permisos
  Roles.associate = function(models) {
    Roles.belongsToMany(models.Permisos, {
      through: 'RolePermisos',
      foreignKey: 'IdRol',
      otherKey: 'IdPermiso',
      as: 'permisos' // Alias para facilitar las consultas
    });
  };

  return Roles;
};
