// models/Pasajeros.js

module.exports = (sequelize, DataTypes) => {
    const Pasajeros = sequelize.define('Pasajeros', {
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
            msg: 'El nombre del pasajero no puede estar vacío'
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
        allowNull: true,
        validate: {
          isEmail: {
            msg: 'Debe ser un correo electrónico válido'
          }
        }
      },
      Telefono: {
        type: DataTypes.STRING(15),
        allowNull: true,
        validate: {
          len: {
            args: [0, 15],
            msg: 'El teléfono no puede tener más de 15 caracteres'
          },
          isNumeric: {
            msg: 'El teléfono debe contener solo números'
          }
        }
      },
      Estatus: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
      }
    }, {
      timestamps: false,
      tableName: 'Pasajeros'
    });
  
    return Pasajeros;
  };
  