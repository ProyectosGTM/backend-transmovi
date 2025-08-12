// models/Permisos.js

module.exports = (sequelize, DataTypes) => {
  const Permisos = sequelize.define('Permisos', {
    Id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    timestamps: false
  });

  // Asociaciones de muchos a muchos
  Permisos.associate = function(models) {
    // Relación con Roles a través de RolePermisos
    Permisos.belongsToMany(models.Roles, {
      through: 'RolePermisos',
      foreignKey: 'IdPermiso',
      otherKey: 'IdRol'
    });

    // Relación con Modulos a través de ModuloPermisos
    Permisos.belongsToMany(models.Modulos, {
      through: 'ModuloPermisos',
      foreignKey: 'IdPermiso',
      otherKey: 'IdModulo'
    });
  };

  return Permisos;
};
