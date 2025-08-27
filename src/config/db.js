const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME_DEV,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        logging: console.log,
        pool: {
            max: 10,
            min: 0,
            idle: 60000,
            acquire: 60000,
            evict: 30000
        }
    }
);

module.exports = sequelize;