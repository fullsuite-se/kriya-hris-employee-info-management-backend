const { Sequelize } = require("sequelize");
const env = require("./env");

const sequelize = new Sequelize(
    env.DB_NAME_DEV,
    env.DB_USER,
    env.DB_PASSWORD,
    {
        host: env.DB_HOST,
        dialect: 'mysql',
        port: env.DB_PORT,
        logging: console.log,
    }
);

module.exports = sequelize;