// models/Transacciones.js

module.exports = (sequelize, DataTypes) => {
    const Transacciones = sequelize.define('Transacciones', {
      Id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      IdMonedero: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Monederos', // Asociado a Monederos
          key: 'Id',
        },
      },
      TipoTransaccion: {
        type: DataTypes.STRING(10), // Puede ser 'Recarga' o 'Debito'
        allowNull: false,
      },
      Monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      Latitud: {
        type: DataTypes.DECIMAL(10, 7), // Coord. Geográficas
        allowNull: true,
      },
      Longitud: {
        type: DataTypes.DECIMAL(10, 7), // Coord. Geográficas
        allowNull: true,
      },
      FechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      Estatus: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1, // 1 = Activo, 0 = Inactivo
      },
    }, {
      timestamps: false, // No agregamos createdAt y updatedAt
      tableName: 'Transacciones',
    });
  
    Transacciones.associate = function(models) {
      Transacciones.belongsTo(models.Monederos, {
        foreignKey: 'IdMonedero',
        as: 'monedero',
      });
    };
  
    return Transacciones;
  };
  