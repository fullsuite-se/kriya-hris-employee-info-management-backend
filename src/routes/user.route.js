const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get('/', userController.getHrisUserAccounts); //fetch all hris-user-accounts -> includes searching after ?
// router.post('/',); //create new hris-user-account
// router.get('/:user_id',); // get specific hris-user-accounts

module.exports = router; 