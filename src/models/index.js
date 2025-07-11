//centralized import
const CompanyAddress = require("./company-address.model");
const CompanyDepartment = require("./company-department.model");
const CompanyDivision = require("./company-division.model");
const CompanyIndustry = require("./company-industry.model");
const CompanyInfo = require("./company-info.model");
const CompanyJobTitle = require("./company-job-title.model");
const Company = require("./company.model");
const HrisShiftsTemplate = require("./hris-shifts-template.model");
const HrisUserAccessPermission = require("./hris-user-access-permission.model");
const HrisUserAccount = require("./hris-user-account.model");
const HrisUserAddress = require("./hris-user-address.model");
const HrisUserDesignation = require("./hris-user-designation.model");
const HrisUserEmergencyContact = require("./hris-user-emergency-contact.model");
const HrisUserEmploymentInfo = require("./hris-user-employment-info.model");
const HrisUserInfo = require("./hris-user-info.model");
const HrisUserPasswordReset = require("./hris-user-password-reset.model");
const HrisUserSalary = require("./hris-user-salary.model");
const HrisUserServicePermission = require("./hris-user-service-permission.model");
const HrisUserShift = require("./hris-user-shift.model");
const LogsActivity = require("./log-activity.model");
const ServiceFeature = require("./service-feature.model");
const Service = require("./service.model");
const SuperAdminAccount = require("./super-admin-account.model");

//define constraints/relationships
HrisUserAccount.hasOne(SuperAdminAccount, { foreignKey: 'user_id', as: 'super_admin' });
SuperAdminAccount.belongsTo(HrisUserAccount, { foreignKey: 'user_id', as: 'user' });

// SuperAdminAccount.hasOne(HrisUserAccount, { foreignKey: 'user_id', as: 'super_admin' });
// HrisUserAccount.belongsTo(SuperAdminAccount, { foreignKey: 'user_id', as: 'user' });

Company.hasOne(CompanyAddress, { foreignKey: 'company_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CompanyAddress.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(CompanyDepartment, { foreignKey: 'company_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CompanyDepartment.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(CompanyDivision, { foreignKey: 'company_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CompanyDivision.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasOne(CompanyInfo, { foreignKey: 'company_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CompanyInfo.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(CompanyJobTitle, { foreignKey: 'company_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CompanyJobTitle.belongsTo(Company, { foreignKey: 'company_id' });

CompanyIndustry.hasMany(CompanyInfo, { foreignKey: 'industry_id' });
CompanyInfo.belongsTo(CompanyIndustry, { foreignKey: 'industry_id' });

// CompanyInfo.hasOne(CompanyIndustry, { foreignKey: 'industry_id' });
// CompanyIndustry.belongsTo(CompanyInfo, { foreignKey: 'industry_id' });

HrisUserAccount.hasMany(HrisUserPasswordReset, { foreignKey: 'user_id' });
HrisUserPasswordReset.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasMany(HrisUserAddress, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserAddress.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasMany(HrisUserAccessPermission, { foreignKey: 'user_id' });
HrisUserAccessPermission.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

ServiceFeature.hasMany(HrisUserAccessPermission, { foreignKey: 'service_feature_id' });
HrisUserAccessPermission.belongsTo(ServiceFeature, { foreignKey: 'service_feature_id' });

// HrisUserAccount.hasMany(HrisUserDesignation, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
// HrisUserDesignation.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

// HrisUserAccount.hasOne(HrisUserDesignation, { foreignKey: 'upline_id' });
// HrisUserDesignation.belongsTo(HrisUserAccount, { foreignKey: 'upline_id', as: 'upline' });

HrisUserAccount.hasMany(HrisUserDesignation, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserDesignation.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasOne(HrisUserDesignation, { foreignKey: 'upline_id' });
HrisUserDesignation.belongsTo(HrisUserAccount, { foreignKey: 'upline_id', as: 'upline' });


Company.hasMany(HrisUserDesignation, { foreignKey: 'company_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserDesignation.belongsTo(Company, { foreignKey: 'company_id' });

CompanyDepartment.hasMany(HrisUserDesignation, { foreignKey: 'department_id', onDelete: 'SET NULL', onUpdate: 'SET NULL' });
HrisUserDesignation.belongsTo(CompanyDepartment, { foreignKey: 'department_id' });

CompanyDivision.hasMany(HrisUserDesignation, { foreignKey: 'division_id', onDelete: 'SET NULL', onUpdate: 'SET NULL' });
HrisUserDesignation.belongsTo(CompanyDivision, { foreignKey: 'division_id' });

CompanyJobTitle.hasMany(HrisUserDesignation, { foreignKey: 'job_title_id', onDelete: 'SET NULL', onUpdate: 'SET NULL' });
HrisUserDesignation.belongsTo(CompanyJobTitle, { foreignKey: 'job_title_id' });

HrisUserShift.hasMany(HrisUserDesignation, { foreignKey: 'user_shift_id' });
HrisUserDesignation.belongsTo(HrisUserShift, { foreignKey: 'user_shift_id' });

HrisUserAccount.hasMany(HrisUserEmergencyContact, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserEmergencyContact.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasOne(HrisUserEmploymentInfo, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserEmploymentInfo.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasOne(HrisUserInfo, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserInfo.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

// HrisUserAccount.hasMany(HrisUserSalary, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
// HrisUserSalary.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasOne(HrisUserSalary, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserSalary.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

// HrisUserAccount.belongsToMany(HrisUserSalary, {
//     through: 'HrisUserSalary',
//     as: 'created_salaries',
//     foreignKey: 'created_by'
// });
// HrisUserSalary.belongsTo(HrisUserAccount, {
//     as: 'creator',
//     foreignKey: 'created_by'
// });

// HrisUserAccount.hasMany(HrisUserShift, { foreignKey: 'user_id' });
// HrisUserShift.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasOne(HrisUserShift, { foreignKey: 'user_id' });
HrisUserShift.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisShiftsTemplate.hasMany(HrisUserShift, { foreignKey: 'shift_template_id' });
HrisUserShift.belongsTo(HrisShiftsTemplate, { foreignKey: 'shift_template_id' });

Service.hasMany(LogsActivity, { foreignKey: 'service_id' });
LogsActivity.belongsTo(Service, { foreignKey: 'service_id' });

Company.hasMany(LogsActivity, { foreignKey: 'company_id' });
LogsActivity.belongsTo(Company, { foreignKey: 'company_id' });

HrisUserAccount.hasMany(LogsActivity, { foreignKey: 'user_id' });
LogsActivity.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

Service.hasMany(ServiceFeature, { foreignKey: 'service_id' });
ServiceFeature.belongsTo(Service, { foreignKey: 'service_id' });

Service.hasMany(HrisUserServicePermission, { foreignKey: 'service_id' });
HrisUserServicePermission.belongsTo(Service, { foreignKey: 'service_id' });

HrisUserAccount.hasMany(HrisUserServicePermission, { foreignKey: 'user_id' });
HrisUserServicePermission.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

//export
module.exports = {
    CompanyAddress,
    CompanyDepartment,
    CompanyDivision,
    CompanyIndustry,
    CompanyInfo,
    CompanyJobTitle,
    Company,
    HrisShiftsTemplate,
    HrisUserAccessPermission,
    HrisUserAccount,
    HrisUserAddress,
    HrisUserDesignation,
    HrisUserEmergencyContact,
    HrisUserEmploymentInfo,
    HrisUserInfo,
    HrisUserPasswordReset,
    HrisUserSalary,
    HrisUserServicePermission,
    HrisUserShift,
    LogsActivity,
    ServiceFeature,
    Service,
    SuperAdminAccount
}
