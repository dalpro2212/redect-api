require('dotenv').config();
console.log('Usuario DB:', process.env.DB_USER);
console.log('Base de datos:', process.env.DB_NAME);
console.log('Host DB:', process.env.DB_HOST);
console.log('Dialect DB:', process.env.DB_DIALECT);

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  }
};