//centralized import
const CompanyAddress = require("./company-address.model");
const CompanyDepartment = require("./company-department.model");
const CompanyDivision = require("./company-division.model");
const CompanyIndustry = require("./company-industry.model");
const CompanyInfo = require("./company-info.model");
const CompanyJobTitle = require("./company-job-title.model");
const Company = require("./company.model");
const HrisUserEmploymentType = require("./hris-user-employement-type.model");
const HrisUserAccessPermission = require("./hris-user-access-permission.model");
const HrisUserAccount = require("./hris-user-account.model");
const HrisUserAddress = require("./hris-user-address.model");
const HrisUserDesignation = require("./hris-user-designation.model");
const HrisUserEmergencyContact = require("./hris-user-emergency-contact.model");
const HrisUserEmploymentInfo = require("./hris-user-employment-info.model");
const HrisUserGovernmentId = require("./hris-user-government-id.model");
const HrisUserInfo = require("./hris-user-info.model");
const HrisUserPasswordReset = require("./hris-user-password-reset.model");
const HrisUserSalary = require("./hris-user-salary.model");
const HrisUserServicePermission = require("./hris-user-service-permission.model");
const LogsActivity = require("./log-activity.model");
const ServiceFeature = require("./service-feature.model");
const Service = require("./service.model");
const SuperAdminAccount = require("./super-admin-account.model");
const HrisUserGovernmentIdType = require("./hris-user-government-id-type.model");
const HrisUserEmploymentStatus = require("./hris-user-employment-status.model");
const HrisUserSalaryAdjustmentType = require("./hris-user-salary-adjustment-type.model");
const CompanyTeam = require("./company-teams.model");
const CompanyOffice = require("./company-office.model");
const HrisUserJobLevel = require("./hris-user-job-level.model");
const HrisUserShiftsTemplate = require("./hris-user-shifts-template.model");
const HrisUserHr201 = require("./hris-user-hr201.model");
const HrisUserAttendance = require("./hris-user-attendance.model");
const HrisUserOvertime = require("./hris-user-overtime.model");
const HrisUserOvertimeType = require("./hris-user-overtime-type.model");

//define constraints/relationships
HrisUserAccount.hasMany(HrisUserAttendance, { foreignKey: 'user_id', onDelete: 'CASCADE' });
HrisUserAttendance.belongsTo(HrisUserAccount, { foreignKey: 'user_id', onDelete: 'CASCADE' });

HrisUserAccount.hasMany(HrisUserOvertime, { foreignKey: 'requester_id', onDelete: 'CASCADE' });
HrisUserOvertime.belongsTo(HrisUserAccount, { foreignKey: 'requester_id', onDelete: 'CASCADE' });

HrisUserOvertimeType.hasMany(HrisUserOvertime, { foreignKey: 'overtime_type_id' });
HrisUserOvertime.belongsTo(HrisUserOvertimeType, { foreignKey: 'overtime_type_id' });


HrisUserAccount.hasMany(HrisUserAccount, { foreignKey: 'created_by', onDelete: 'CASCADE' });
HrisUserAccount.belongsTo(HrisUserAccount, { foreignKey: 'created_by' });

HrisUserAccount.hasOne(HrisUserHr201, { foreignKey: 'user_id', onDelete: 'CASCADE' });
HrisUserHr201.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

CompanyOffice.hasMany(HrisUserDesignation, { foreignKey: 'office_id', onDelete: 'CASCADE' },);
HrisUserDesignation.belongsTo(CompanyOffice, { foreignKey: 'office_id' });

CompanyTeam.hasMany(HrisUserDesignation, { foreignKey: 'team_id', onDelete: 'CASCADE' });
HrisUserDesignation.belongsTo(CompanyTeam, { foreignKey: 'team_id' });

HrisUserAccount.hasMany(HrisUserGovernmentId, { foreignKey: 'user_id', onDelete: 'CASCADE' });
HrisUserGovernmentId.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserGovernmentIdType.hasMany(HrisUserGovernmentId, { foreignKey: 'government_id_type_id', onDelete: 'CASCADE' });
HrisUserGovernmentId.belongsTo(HrisUserGovernmentIdType, { foreignKey: 'government_id_type_id' });

HrisUserEmploymentStatus.hasMany(HrisUserEmploymentInfo, { foreignKey: 'employment_status_id', onDelete: 'CASCADE' });
HrisUserEmploymentInfo.belongsTo(HrisUserEmploymentStatus, { foreignKey: 'employment_status_id' });

HrisUserSalaryAdjustmentType.hasMany(HrisUserSalary, { foreignKey: 'salary_adjustment_type_id', onDelete: 'CASCADE' });
HrisUserSalary.belongsTo(HrisUserSalaryAdjustmentType, { foreignKey: 'salary_adjustment_type_id' });

Company.hasMany(CompanyTeam, { foreignKey: 'company_id', onDelete: 'CASCADE' });
CompanyTeam.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(CompanyOffice, { foreignKey: 'company_id', onDelete: 'CASCADE' });
CompanyOffice.belongsTo(Company, { foreignKey: 'company_id' });

HrisUserJobLevel.hasMany(HrisUserEmploymentInfo, { foreignKey: 'job_level_id', onDelete: 'CASCADE' })
HrisUserEmploymentInfo.belongsTo(HrisUserJobLevel, { foreignKey: 'job_level_id' });

HrisUserEmploymentType.hasMany(HrisUserEmploymentInfo, { foreignKey: 'employment_type_id', onDelete: 'CASCADE' });
HrisUserEmploymentInfo.belongsTo(HrisUserEmploymentType, { foreignKey: 'employment_type_id' })

HrisUserAccount.hasOne(SuperAdminAccount, { foreignKey: 'user_id', as: 'super_admin' });
SuperAdminAccount.belongsTo(HrisUserAccount, { foreignKey: 'user_id', as: 'user' });

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

HrisUserAccount.hasMany(HrisUserEmergencyContact, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserEmergencyContact.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasOne(HrisUserEmploymentInfo, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserEmploymentInfo.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasOne(HrisUserInfo, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserInfo.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserAccount.hasOne(HrisUserSalary, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HrisUserSalary.belongsTo(HrisUserAccount, { foreignKey: 'user_id' });

HrisUserShiftsTemplate.hasMany(HrisUserEmploymentInfo, { foreignKey: 'shift_template_id', onDelete: 'CASCADE' });
HrisUserEmploymentInfo.belongsTo(HrisUserShiftsTemplate, { foreignKey: 'shift_template_id' });

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
    LogsActivity,
    ServiceFeature,
    Service,
    SuperAdminAccount,
    HrisUserGovernmentId,
    HrisUserGovernmentIdType,
    HrisUserEmploymentStatus,
    HrisUserSalaryAdjustmentType,
    CompanyTeam,
    CompanyOffice,
    HrisUserJobLevel,
    HrisUserEmploymentType,
    HrisUserShiftsTemplate,
    HrisUserHr201,


}
