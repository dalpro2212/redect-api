'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Prestamo extends Model {
    static associate(models) {
      // Cada préstamo pertenece a un usuario y a un equipo
      Prestamo.belongsTo(models.User, { foreignKey: 'userId', as: 'usuario' });
      Prestamo.belongsTo(models.Equipo, { foreignKey: 'equipoId', as: 'equipo' });
    }
  }

  Prestamo.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // ... el resto queda igual
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    equipoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechaPrestamo: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fechaDevolucionEsperada: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaDevolucionReal: {
      type: DataTypes.DATE
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Devuelto'),
      allowNull: false,
      defaultValue: 'Activo'
    }
  }, {
    sequelize,
    modelName: 'Prestamo',
    tableName: 'Prestamos'
  });

  return Prestamo;
};