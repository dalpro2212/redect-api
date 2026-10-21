'use strict';

module.exports = {
  async up(queryInterface) {
    const ahora = new Date();
    const base = { createdAt: ahora, updatedAt: ahora };
    await queryInterface.bulkInsert('Equipos', [
      { nombre: 'Cámara Canon EOS 250D', categoria: 'audiovisual', descripcion: 'Cámara DSLR con lente 18-55mm', estado: 'Disponible', ...base },
      { nombre: 'Proyector Epson X41', categoria: 'audiovisual', descripcion: 'Proyector con HDMI', estado: 'Disponible', ...base },
      { nombre: 'Taladro Bosch 650W', categoria: 'herramienta', descripcion: 'Taladro con set de brocas', estado: 'Disponible', ...base },
      { nombre: 'Kit de destornilladores', categoria: 'herramienta', descripcion: '32 piezas de precisión', estado: 'Disponible', ...base },
      { nombre: 'Laptop Lenovo IdeaPad 3', categoria: 'laptop', descripcion: 'Ryzen 5, 8GB RAM', estado: 'Disponible', ...base },
      { nombre: 'Laptop HP 14', categoria: 'laptop', descripcion: 'Core i3, 8GB RAM', estado: 'Disponible', ...base },
      { nombre: 'Trípode Manfrotto', categoria: 'audiovisual', descripcion: 'Trípode de aluminio', estado: 'En mantenimiento', ...base }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Equipos', null, {});
  }
};