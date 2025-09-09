const express = require("express");
const router = express.Router();
const hrisUserServicePermissionController = require("../controllers/admin-controllers/hris-user-service-permission.controller");
const hrisUserAccessPermissionController = require("../controllers/admin-controllers/hris-user-access-permission.controller");
const { authenticateJWTToken } = require("../middleware/auth.middleware");

//base url: /api/admin

//managing user's service access: hris-user-service-permission
router.get('/service/hris-user-accounts/:user_id', hrisUserServicePermissionController.getAll);
router.post('/service/hris-user-accounts/:user_id', hrisUserServicePermissionController.create);
router.delete('/service/hris-user-accounts/:user_id', hrisUserServicePermissionController.delete);

//managing user's feature access: hris-user-access-permission
router.get('/features/hris-user-accounts/:user_id', hrisUserAccessPermissionController.getAll);
router.post('/features/hris-user-accounts/:user_id', hrisUserAccessPermissionController.create);
router.delete('/features/hris-user-accounts/:user_id', hrisUserAccessPermissionController.delete);


//fetch all services and its features
router.get('/services-and-features', authenticateJWTToken, hrisUserServicePermissionController.getAllServicesAndFeatures );


//fetch all features of a service
router.get('/features/:service_id', authenticateJWTToken, hrisUserServicePermissionController.getAllFeatures );

module.exports = router;
