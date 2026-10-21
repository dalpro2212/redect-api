'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Equipo extends Model {
    static associate(models) {
      // 1:N: un equipo tiene muchos préstamos (historial)
      Equipo.hasMany(models.Prestamo, { foreignKey: 'equipoId', as: 'prestamos' });

      // N:M: un equipo se relaciona con muchos usuarios a través de Prestamo
      Equipo.belongsToMany(models.User, {
        through: models.Prestamo,
        foreignKey: 'equipoId',
        otherKey: 'userId',
        as: 'usuarios'
      });
    }
  }

  Equipo.init({
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    categoria: {
      type: DataTypes.ENUM('audiovisual', 'herramienta', 'laptop'),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    estado: {
      type: DataTypes.ENUM('Disponible', 'Prestado', 'En mantenimiento'),
      allowNull: false,
      defaultValue: 'Disponible'
    }
  }, {
    sequelize,
    modelName: 'Equipo',
    tableName: 'Equipos'
  });

  return Equipo;
};