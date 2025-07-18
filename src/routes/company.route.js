const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company-controllers/company.controller");
const companyTeamController = require("../controllers/company-controllers/company-teams.controller");
const companyOfficeController = require("../controllers/company-controllers/company-office.controller");
const companyDepartmentController = require("../controllers/company-controllers/company-deparment.controller");
const companyDivisionController = require("../controllers//company-controllers/company-division.controller");
const companyJobTitleController = require("../controllers/company-controllers/company-job.controller");
const companyIndustryController = require("../controllers/company-controllers/company-industry.controller");

//company
router.get('/', companyController.getCompanies);
router.get('/:company_id', companyController.getCompany);

//company-teams
router.post('/:company_id/teams', companyTeamController.create); //create new company team
router.get('/:company_id/teams', companyTeamController.getAll); //get all company team
router.get('/:company_id/:team_id', companyTeamController.getOne);
router.put('/:company_id/:team_id', companyTeamController.update);
router.delete('/:company_id/:team_id', companyTeamController.delete);

//company-office
router.post('/:company_id/offices', companyOfficeController.create); //create new company office
router.get('/:company_id/offices', companyOfficeController.getAll); //get all company offices
router.get('/:company_id/:office_id', companyOfficeController.getOne);
router.put('/:company_id/:office_id', companyOfficeController.update);
router.delete('/:company_id/:office_id', companyOfficeController.delete);

//company-departments
router.post('/:company_id/deparments', companyDepartmentController.create); //create new department
router.get('/:company_id/departments', companyDepartmentController.getAll); //get all departmenet
router.get('/:company_id/:department_id', companyDepartmentController.getOne);
router.put('/:company_id/:department_id', companyDepartmentController.update);
router.delete('/:company_id/:department_id', companyDepartmentController.delete);

//company-division
router.post('/:company_id/divisions', companyDivisionController.create); //create new department
router.get('/:company_id/division', companyDivisionController.getAll); //get all departmenet
router.get('/:company_id/:division_id', companyDivisionController.getOne);
router.put('/:company_id/:division_id', companyDivisionController.update);
router.delete('/:company_id/:division_id', companyDivisionController.delete);

//company-job-titles
router.post('/:company_id/jobs', companyJobTitleController.create); //create new job title
router.get('/:company_id/jobs', companyJobTitleController.getAll); //get all job title
router.get('/:company_id/:job_title_id', companyJobTitleController.getOne);
router.put('/:company_id/:job_title_id', companyJobTitleController.update);
router.delete('/:company_id/:job_title_id', companyJobTitleController.delete);

//company-industries
router.post('/:company_id/job-industries', companyIndustryController.create); //create new job industry
router.get('/:company_id/job-industries', companyIndustryController.getAll); //get all job industry
// router.get('/:company_id/:industry_id',companyIndustryController.);
router.put('/:company_id/:industry_id', companyIndustryController.update);
router.delete('/:company_id/:industry_id', companyIndustryController.delete);

module.exports = router; 