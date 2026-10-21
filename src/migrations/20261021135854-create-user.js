'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { allowNull: false, type: Sequelize.STRING(100) },
      email: { allowNull: false, unique: true, type: Sequelize.STRING(150) },
      password: { allowNull: false, type: Sequelize.STRING(255) },
      rol: {
        allowNull: false,
        type: Sequelize.ENUM('admin', 'usuario'),
        defaultValue: 'usuario'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  }
};