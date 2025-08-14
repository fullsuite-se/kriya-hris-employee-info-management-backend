/**
 * authenticateJWTToken middleware checks if access token is present
 * checkAuthorizationToAccessFeature middleware checks if user has access to features
 * **/

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const hrisUserEmploymentInfoController = require("../controllers/employment-controllers/hris-user-employment-info.controller");
const hrisUserShiftTemplateController = require("../controllers/employment-controllers/hris-user-shifts-template.controller");
const hrisUserGovernmentIdController = require("../controllers/employment-controllers/hris-user-government-id.controller");
const hrisUserGovernmentIdTypeController = require("../controllers/employment-controllers/hris-user-government-id-type.controller");
const hrisUserHr201Controller = require("../controllers/employment-controllers/hris-user-hr201.controller");
const hrisUserSalaryController = require("../controllers/employment-controllers/hris-user-salary.controller");
const hrisUserSalaryAdjustmentTypeController = require("../controllers/employment-controllers/hris-user-salary-adjustment-type.controller");
const hrisUserJobLevelController = require("../controllers/employment-controllers/hris-user-job-level.controller");
const hrisUserEmploymentStatusController = require("../controllers/employment-controllers/hris-user-employment-status.controller");
const hrisUserEmploymentTypeController = require("../controllers/employment-controllers/hris-user-employement-type.controller");
const { authenticateJWTToken } = require("../middleware/auth.middleware");
const { checkAuthorizationToAccessFeature } = require("../middleware/authorization.middleware");
const env = require("../config/env");

//base: /hris-user-accounts
/**
 * /hris-user-accounts/ fetches all users
 * ?query support search based on email and name.
 * ?service_feature_id support searching users with an access to a feature (can approve, can edit payroll)
 * ?service_id support searching users with an access to service (ats, payroll, suitelifer,)
 * **/

router.get('/', authenticateJWTToken, userController.getHrisUserAccounts);
// router.get('/', authenticateJWTToken, checkAuthorizationToAccessFeature([env.EMPLOYEE_MANAGEMENT]), userController.getHrisUserAccounts);
router.post('/', authenticateJWTToken, userController.createHrisUserAccount);
router.get('/:user_id', authenticateJWTToken, userController.getHrisUserAccount);
router.get('/:user_id/basic-info', authenticateJWTToken, userController.getHrisUserAccountBasicInfo);


// //employment-info
router.get('/:user_id/employment-info', hrisUserEmploymentInfoController.getOne);
router.patch('/:user_id/employment-info', hrisUserEmploymentInfoController.update);

// //employment-info/shift-templates
router.post('/employment-info/shift-templates', hrisUserShiftTemplateController.create);
router.get('/employment-info/shift-templates', hrisUserShiftTemplateController.getAll);
router.get('/employment-info/shift-templates/:shift_template_id', hrisUserShiftTemplateController.getOne);
router.patch('/employment-info/shift-templates/:shift_template_id', hrisUserShiftTemplateController.update);
router.delete('/employment-info/shift-templates/:shift_template_id', hrisUserShiftTemplateController.delete);

// //employment-info/job-levels
router.post('/employment-info/job-levels', hrisUserJobLevelController.create);
router.get('/employment-info/job-levels', hrisUserJobLevelController.getAll)
// router.get('/employment-info/job-levels/:job_level_id',)
// router.patch('/employment-info/job-levels/:job_level_id',)
// router.delete('/employment-info/job-levels/:job_level_id',)

// //employment-info/employment-statuses
router.post('/employment-info/employment-statuses', hrisUserEmploymentStatusController.create);
router.get('/employment-info/employment-statuses', hrisUserEmploymentStatusController.getAll);
// router.get('/employment-info/employment-statuses/:employment_status_id',);
// router.patch('/employment-info/employment-statuses/:employment_status_id',);
// router.delete('/employment-info/employment-statuses/:employment_status_id',);

// //employment-info/employement-type
router.post('/employment-info/employment-types', hrisUserEmploymentTypeController.create);
router.get('/employment-info/employment-types', hrisUserEmploymentTypeController.getAll);
// router.get('/employment-info/employment-types/:employment_type_id',);
// router.patch('/employment-info/employment-types/:employment_type_id',);
// router.delete('/employment-info/employment-types/:employment_type_id',);

//salaries
router.get('/:user_id/salaries', hrisUserSalaryController.getOne);
router.patch('/:user_id/salaries/:user_salary_id', hrisUserSalaryController.update); //this is tentative since we don't know just yet it is many

//salaries/adjustment-types
router.post('/salaries/adjustment-types', hrisUserSalaryAdjustmentTypeController.create);
router.get('/salaries/adjustment-types', hrisUserSalaryAdjustmentTypeController.getAll);
// router.get('/salaries/adjustment-types/:salary_adjustment_type_id',);
// router.patch('/salaries/adjustment-types/:salary_adjustment_type_id',);
// router.delete('/salaries/adjustment-types/:salary_adjustment_type_id',);

//gov-ids
router.post('/:user_id/gov-ids', hrisUserGovernmentIdController.create);
router.get('/:user_id/gov-ids', hrisUserGovernmentIdController.getAll); //gov-ids of user
router.get('/:user_id/gov-ids/:user_government_id', hrisUserGovernmentIdController.getOne); //edit the user government_id_number
router.patch('/:user_id/gov-ids/:user_government_id', hrisUserGovernmentIdController.update); //edit the user government_id_number
router.delete('/:user_id/gov-ids/:user_government_id', hrisUserGovernmentIdController.delete); //delete the user government_id_number

//gov-ids/types
router.get('/gov-ids/types', hrisUserGovernmentIdTypeController.getAll);
router.post('/gov-ids/types', hrisUserGovernmentIdTypeController.create); //adds new id types
// router.get('gov-ids/types/:government_id_type_id',);
// router.patch('gov-ids/types/:government_id_type_id',);
// router.delete('gov-ids/types/:government_id_type_id',);


// //hr201
router.get('/:user_id/hr201', hrisUserHr201Controller.getOne);
router.patch('/:user_id/hr201', hrisUserHr201Controller.update); //since its been already setup upon creation

//password-reset


//attendances

//overtimes

module.exports = router;

