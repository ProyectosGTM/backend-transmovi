// models/Usuarios.js

module.exports = (sequelize, DataTypes) => {
  const Usuarios = sequelize.define('Usuarios', {
    Id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'El nombre de usuario ya está en uso'
      },
      validate: {
        notEmpty: {
          msg: 'El nombre de usuario no puede estar vacío'
        },
        len: {
          args: [4, 100],
          msg: 'El nombre de usuario debe tener entre 4 y 100 caracteres'
        }
      }
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La contraseña no puede estar vacía'
        },
        len: {
          args: [6, 255],
          msg: 'La contraseña debe tener al menos 6 caracteres'
        }
      }
    },
    EmailConfirmed: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    Telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        isNumeric: {
          msg: 'El teléfono solo puede contener números'
        },
        len: {
          args: [0, 20],
          msg: 'El teléfono no puede exceder los 20 caracteres'
        }
      }
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'El nombre no puede exceder los 100 caracteres'
        }
      }
    },
    ApellidoPaterno: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'El apellido paterno no puede exceder los 100 caracteres'
        }
      }
    },
    ApellidoMaterno: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'El apellido materno no puede exceder los 100 caracteres'
        }
      }
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    IdRol: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'Id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    IdCliente: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Clientes',
        key: 'Id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }
  }, {
    timestamps: false, // Activamos createdAt y updatedAt
    tableName: 'Usuarios' // Nombre explícito de la tabla
  });

  // Asociaciones
  Usuarios.associate = function(models) {
    // Asociación con la tabla Roles
    Usuarios.belongsTo(models.Roles, {
      foreignKey: 'IdRol',
      as: 'rol'
    });

    // Asociación con la tabla Clientes
    Usuarios.belongsTo(models.Clientes, {
      foreignKey: 'IdCliente',
      as: 'cliente'
    });
  };

  return Usuarios;
};
