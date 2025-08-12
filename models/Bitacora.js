// models/Bitacora.js

module.exports = (sequelize, DataTypes) => {
    const Bitacora = sequelize.define('Bitacora', {
      Id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      Modulo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Descripcion: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      Accion: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      Fecha: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      Query: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      IdUsuario: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    }, {
      timestamps: false,
      tableName: 'Bitacora'
    });
  
    return Bitacora;
  };
  