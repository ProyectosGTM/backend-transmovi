// models/Dispositivos.js

module.exports = (sequelize, DataTypes) => {
    const Dispositivos = sequelize.define('Dispositivos', {
      Id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      NumeroSerie: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'El número de serie no puede estar vacío'
          }
        }
      },
      Marca: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La marca no puede estar vacía'
          }
        }
      },
      Modelo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El modelo no puede estar vacío'
          }
        }
      },
      Estatus: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1, // Activo por defecto
        validate: {
          isIn: {
            args: [[0, 1]], // 0 = Inactivo, 1 = Activo
            msg: 'El estatus debe ser 0 (Inactivo) o 1 (Activo)'
          }
        }
      }
    }, {
      timestamps: false,
      tableName: 'Dispositivos'
    });
  
    return Dispositivos;
  };
  