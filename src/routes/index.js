const express = require("express");
const router = express.Router();

const userRoutes = require('./user.route');
const adminRoutes = require('./admin.route');
const authRoutes = require('./auth.route');
const companyRoutes = require('./company.route');

router.use('/hris-user-accounts', userRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);

module.exports = router;