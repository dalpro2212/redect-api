const Sequelize = require('sequelize');
const config = require('../config/config');

const env = 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Equipo = require('./equipo')(sequelize, Sequelize.DataTypes);
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Prestamo = require('./prestamo')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;