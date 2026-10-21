'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const ahora = new Date();
    await queryInterface.bulkInsert('Users', [
      {
        nombre: 'Administrador RedTec',
        email: 'admin@redtec.com',
        password: await bcrypt.hash('Admin123*', 10),
        rol: 'admin',
        createdAt: ahora,
        updatedAt: ahora
      },
      {
        nombre: 'Usuario Demo',
        email: 'usuario@redtec.com',
        password: await bcrypt.hash('Usuario123*', 10),
        rol: 'usuario',
        createdAt: ahora,
        updatedAt: ahora
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', {
      email: ['admin@redtec.com', 'usuario@redtec.com']
    });
  }
};