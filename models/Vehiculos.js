// models/Vehiculos.js

module.exports = (sequelize, DataTypes) => {
    const Vehiculos = sequelize.define('Vehiculos', {
      Id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      Marca: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La marca del vehículo no puede estar vacía'
          }
        }
      },
      Modelo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El modelo del vehículo no puede estar vacío'
          }
        }
      },
      Ano: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'El año debe ser un número entero'
          },
          min: {
            args: 1900,
            msg: 'El año debe ser mayor a 1900'
          }
        }
      },
      Placa: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'La placa del vehículo no puede estar vacía'
          }
        }
      },
      NumeroEconomico: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'El número económico no puede estar vacío'
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
      tableName: 'Vehiculos'
    });
  
    Vehiculos.associate = function(models) {
      // Asociación con Operador
      Vehiculos.belongsTo(models.Operadores, {
        foreignKey: 'IdOperador',
        as: 'operador'
      });
      
      // Asociación con Dispositivo
      Vehiculos.belongsTo(models.Dispositivos, {
        foreignKey: 'IdDispositivo',
        as: 'dispositivo'
      });
    };
  
    return Vehiculos;
  };
  