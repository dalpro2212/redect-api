'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Equipos', 'foto', {
      type: Sequelize.STRING(500),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Equipos', 'foto');
  }
};