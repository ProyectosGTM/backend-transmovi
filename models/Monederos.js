// models/Monederos.js

module.exports = (sequelize, DataTypes) => {
    const Monederos = sequelize.define('Monederos', {
      Id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      NumeroSerie: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'El número de serie no puede estar vacío'
          }
        }
      },
      FechaActivacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: {
            msg: 'Debe ser una fecha válida'
          }
        }
      },
      Saldo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
          isDecimal: {
            msg: 'El saldo debe ser un valor decimal válido'
          },
          min: {
            args: [0],
            msg: 'El saldo no puede ser negativo'
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
      tableName: 'Monederos'
    });
  
    return Monederos;
  };
  