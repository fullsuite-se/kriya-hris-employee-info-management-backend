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
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectModule: require("mysql2"), 
    logging: false, 

    pool: {
      max: 5, 
      min: 0,
      acquire: 30000, 
      idle: 10000, 
    },
  }
);

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("✅ Database connected successfully.");
//   } catch (error) {
//     console.error("❌ Unable to connect to the database:", error.message);
//   }
// })();

module.exports = sequelize;
