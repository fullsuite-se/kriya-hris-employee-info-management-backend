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
const { recaptcha } = require('../middleware/recaptcha.middleware');

router.post('/login', authController.login);


router.post("/reset-request", authController.requestResetPasswordHris);
router.post("/verify-otp", authController.verifyOTP);
router.patch("/reset-password", authController.resetPasswordHris);


module.exports = router;