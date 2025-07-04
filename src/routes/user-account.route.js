const express = require("express");
const router = express.Router();
const userAccountController = require("../controllers/user-account.controller");

router.get('/', userAccountController.findUserAccount);

module.exports = router; 