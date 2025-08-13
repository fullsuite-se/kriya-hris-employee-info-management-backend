const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const sequelize = require("./config/db");
const routes = require("./routes");
const env = require("./config/env");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, "public")));

app.use(cors({
    origin: [env.VITE_FRONTEND_URL_DEVELOPMENT, env.VITE_FRONTEND_URL_PRODUCTION],
    credentials: false,
}));


//this is to run the db and sync the tables
require("./models");

app.use('/api', routes);



(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({
            force: true,
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    finally {
        console.log('Database Sync successfully');
    }
})();


app.get('/', (req, res) => {
    res.status(200).json({ message: "okay" })
});

module.exports = app; 