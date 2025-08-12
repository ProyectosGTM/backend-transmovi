// models/Operadores.js

module.exports = (sequelize, DataTypes) => {
    const Operadores = sequelize.define('Operadores', {
      Id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      Nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El nombre del operador no puede estar vacío'
          }
        }
      },
      ApellidoPaterno: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El apellido paterno no puede estar vacío'
          }
        }
      },
      ApellidoMaterno: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      NumeroLicencia: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'El número de licencia no puede estar vacío'
          }
        }
      },
      FechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'La fecha de nacimiento debe ser una fecha válida'
          }
        }
      },
      Correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Debe ser un correo electrónico válido'
          }
        }
      },
      Telefono: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          isNumeric: {
            msg: 'El teléfono debe contener solo números'
          },
          len: {
            args: [10],
            msg: 'El teléfono debe tener exactamente 10 dígitos'
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
      tableName: 'Operadores'
    });
  
    return Operadores;
  };
  