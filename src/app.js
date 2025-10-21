import express from "express";
import path from "path";
import cors from "cors";
import routes from "./routes/index.js";
import env from "./config/env.js";
import { startRegularizationJob } from "./cron/employment-regularization.cron.js";
import { startSeparationJob } from "./cron/employment-separated.cron.js";

const app = express();

app.use(cors({
  origin: [
    env.VITE_FRONTEND_URL_DEVELOPMENT,
    env.VITE_FRONTEND_URL_PRODUCTION,
    env.VITE_FRONTEND_PAYROLL_URL_DEVELOPMENT,
    env.VITE_FRONTEND_PAYROLL_URL_PRODUCTION,
    env.VITE_FRONTEND_URL_DEVELOPMENT_SL,
    env.VITE_FRONTEND_URL_PRODUCTION_SL,
    "https://kriya-hris.vercel.app"
  ],
  credentials: true,
}));

console.log("Allowed origins:", [
  env.VITE_FRONTEND_URL_DEVELOPMENT,
  env.VITE_FRONTEND_URL_PRODUCTION,
  env.VITE_FRONTEND_PAYROLL_URL_DEVELOPMENT,
  env.VITE_FRONTEND_PAYROLL_URL_PRODUCTION,
  env.VITE_FRONTEND_URL_DEVELOPMENT_SL,
  env.VITE_FRONTEND_URL_PRODUCTION_SL,
  "https://kriya-hris.vercel.app",
]);

startRegularizationJob();
startSeparationJob();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static(path.join(__dirname, "..", "public")));
app.use('/api', routes);

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
