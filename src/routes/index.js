const express = require("express");
const router = express.Router();

const userAccountRoute = require("./user-account.route");

router.use("/user-account", userAccountRoute);

module.exports = router;