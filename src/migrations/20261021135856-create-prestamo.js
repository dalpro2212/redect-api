'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Prestamos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      equipoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Equipos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      fechaPrestamo: {
        allowNull: false,
        type: Sequelize.DATE
      },
      fechaDevolucionEsperada: {
        allowNull: false,
        type: Sequelize.DATE
      },
      fechaDevolucionReal: {
        type: Sequelize.DATE
      },
      estado: {
        allowNull: false,
        type: Sequelize.ENUM('Activo', 'Devuelto'),
        defaultValue: 'Activo'
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
    await queryInterface.dropTable('Prestamos');
  }
};