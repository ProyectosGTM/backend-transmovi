// models/Modulos.js

module.exports = (sequelize, DataTypes) => {
    const Modulos = sequelize.define('Modulos', {
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
  
    // Asociaciones con Permisos a través de ModuloPermisos
    Modulos.associate = function(models) {
      Modulos.belongsToMany(models.Permisos, {
        through: 'ModuloPermisos',
        foreignKey: 'IdModulo',
        otherKey: 'IdPermiso'
      });
    };
  
    return Modulos;
  };
  