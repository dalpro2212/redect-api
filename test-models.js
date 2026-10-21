const db = require('./src/models');

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Conexión OK');
    console.log('Modelos cargados:', Object.keys(db).filter(k => !['sequelize', 'Sequelize'].includes(k)));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.sequelize.close();
  }
})();