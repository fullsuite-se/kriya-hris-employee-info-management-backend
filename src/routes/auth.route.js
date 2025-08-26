/*
function: The HRIS backend (auth resource) will serve as the Authentication provider 
for all the systems in Kriya ecosystemd, i.e., 
1) Payroll, 
2) Employee management (HRIS), 
3) Suitelifer
4) ATS
*/

const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post('/login', authController.login);

module.exports = router;