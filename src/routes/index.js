const express = require("express");
const router = express.Router();

const userRoutes = require('./user.route');
// const adminRoutes = require('./admin.route');
const authRoutes = require('./auth.route');

router.use('/hris-user-accounts', userRoutes);
// router.use('/admin', adminRoutes);
// router.use('/auth', authRoutes);

module.exports = router;