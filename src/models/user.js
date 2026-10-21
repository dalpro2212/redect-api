'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 1:N: un usuario tiene muchos préstamos
      User.hasMany(models.Prestamo, { foreignKey: 'userId', as: 'prestamos' });

      // N:M: un usuario se relaciona con muchos equipos a través de Prestamo
      User.belongsToMany(models.Equipo, {
        through: models.Prestamo,
        foreignKey: 'userId',
        otherKey: 'equipoId',
        as: 'equipos'
      });
    }
  }

  User.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM('admin', 'usuario'),
      allowNull: false,
      defaultValue: 'usuario'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  });

  return User;
};