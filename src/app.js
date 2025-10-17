const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const sequelize = require("./config/db");
const routes = require("./routes");
const env = require("./config/env");
const { startRegularizationJob } = require("./cron/employment-regularization.cron");
const { startSeparationJob } = require("./cron/employment-separated.cron");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, "..", "public")));


app.use(cors({
    origin: [env.VITE_FRONTEND_URL_DEVELOPMENT, env.VITE_FRONTEND_URL_PRODUCTION, env.VITE_FRONTEND_PAYROLL_URL_DEVELOPMENT, env.VITE_FRONTEND_PAYROLL_URL_PRODUCTION, env.VITE_FRONTEND_URL_DEVELOPMENT_SL, env.VITE_FRONTEND_URL_PRODUCTION_SL],
    credentials: true,
}));

startRegularizationJob();
startSeparationJob();

app.use('/api', routes);



app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app; 