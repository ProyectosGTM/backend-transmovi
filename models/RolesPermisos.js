// models/RolePermisos.js

module.exports = (sequelize, DataTypes) => {
  const RolePermisos = sequelize.define('RolePermisos', {
    IdRol: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'Id'
      },
      onDelete: 'CASCADE', // Asegurarse de que los permisos se eliminen cuando se elimine el rol
      onUpdate: 'CASCADE'
    },
    IdPermiso: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Permisos',
        key: 'Id'
      },
      onDelete: 'CASCADE', // Asegurarse de que las asociaciones se eliminen cuando se elimine el permiso
      onUpdate: 'CASCADE'
    }
  }, {
    timestamps: false, // No necesitamos timestamps en una tabla intermedia
    tableName: 'RolePermisos', // Nombre explícito de la tabla intermedia
    indexes: [
      {
        unique: true, // Evitar duplicados entre combinaciones de IdRol e IdPermiso
        fields: ['IdRol', 'IdPermiso']
      }
    ]
  });

  return RolePermisos;
};
