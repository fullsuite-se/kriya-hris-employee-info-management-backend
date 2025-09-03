// const { Sequelize } = require("sequelize");
// const env = require("./env");

// const sequelize = new Sequelize(
//     env.DB_NAME_DEV,
//     env.DB_USER,
//     env.DB_PASSWORD,
//     {
//         host: env.DB_HOST,
//         dialect: 'mysql',
//         port: env.DB_PORT,
//         logging: console.log,
//         pool: {
//             max: 10,
//             min: 0,
//             idle: 60000,
//             acquire: 60000,
//             evict: 30000
//         }
//     }
// );

// module.exports = sequelize;

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
        pool: false,
    }
);

module.exports = sequelize;