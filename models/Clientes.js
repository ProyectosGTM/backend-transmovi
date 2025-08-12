// models/Clientes.js

module.exports = (sequelize, DataTypes) => {
  const Clientes = sequelize.define('Clientes', {
    Id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    IdPadre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El campo IdPadre no puede estar vacío'
        }
      }
    },
    RFC: {
      type: DataTypes.STRING(16),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El RFC es obligatorio'
        },
        len: {
          args: [12, 16],
          msg: 'El RFC debe tener entre 12 y 16 caracteres'
        }
      }
    },
    TipoPersona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'TipoPersona debe ser un valor entero'
        }
      }
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    Logotipo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Nombre: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ApellidoPaterno: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ApellidoMaterno: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Telefono: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: {
          args: [0, 10],
          msg: 'El teléfono no puede tener más de 10 dígitos'
        },
        isNumeric: {
          msg: 'El teléfono debe contener solo números'
        }
      }
    },
    Correo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Debe ser un correo electrónico válido'
        },
        len: {
          args: [0, 100],
          msg: 'El correo no puede tener más de 100 caracteres'
        }
      }
    },
    Estado: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Municipio: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Colonia: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Calle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EntreCalles: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    NumeroExterior: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    NumeroInterior: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CP: {
      type: DataTypes.STRING(5),
      allowNull: true,
      validate: {
        len: {
          args: [0, 5],
          msg: 'El código postal no puede tener más de 5 dígitos'
        }
      }
    },
    NombreEncargado: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    TelefonoEncargado: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: {
          args: [0, 10],
          msg: 'El teléfono del encargado no puede tener más de 10 dígitos'
        },
        isNumeric: {
          msg: 'El teléfono del encargado debe contener solo números'
        }
      }
    },
    EmailEncargado: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Debe ser un correo electrónico válido para el encargado'
        }
      }
    }
  }, {
    timestamps: false, // Añadir campos de timestamps (createdAt, updatedAt)
    tableName: 'Clientes' // Asegurarse de que la tabla tenga un nombre claro
  });

  // Asociación con Usuarios (Un cliente puede tener muchos usuarios)
  Clientes.associate = function(models) {
    Clientes.hasMany(models.Usuarios, {
      foreignKey: 'IdCliente',
      as: 'usuarios'
    });
  };

  return Clientes;
};
