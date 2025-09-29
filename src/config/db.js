const { Sequelize } = require("sequelize");
const env = require("./env");

const sequelize = new Sequelize(
  env.DB_NAME_DEV,
  env.DB_USER,
  env.DB_PASSWORD,

  {
    timezone: "+08:00",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },

    dialectOptions: {
      connectTimeout: 20000,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;
