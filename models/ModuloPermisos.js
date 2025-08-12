// models/ModuloPermisos.js

module.exports = (sequelize, DataTypes) => {
    const ModuloPermisos = sequelize.define('ModuloPermisos', {
      IdModulo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Modulos',
          key: 'Id'
        }
      },
      IdPermiso: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Permisos',
          key: 'Id'
        }
      }
    }, {
      timestamps: false
    });
  
    return ModuloPermisos;
  };
  