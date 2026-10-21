'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Equipos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING(150)
      },
      categoria: {
        allowNull: false,
        type: Sequelize.ENUM('audiovisual', 'herramienta', 'laptop')
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      estado: {
        allowNull: false,
        type: Sequelize.ENUM('Disponible', 'Prestado', 'En mantenimiento'),
        defaultValue: 'Disponible'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Equipos');
  }
};