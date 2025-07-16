const { Op } = require("sequelize");
const { HrisUserAccount, HrisUserInfo, HrisUserAddress, HrisUserEmergencyContact, HrisUserEmploymentInfo, HrisUserDesignation, HrisUserShift, HrisUserSalary, Company, CompanyAddress, CompanyDepartment, CompanyDivision, CompanyInfo, CompanyJobTitle, CompanyIndustry, HrisUserSalaryAdjustmentType, HrisUserJobLevel, HrisUserEmploymentStatus, HrisUserEmploymentType, HrisUserHr201, CompanyOffice, CompanyTeam, HrisUserGovernmentId, HrisUserGovernmentIdType, HrisUserShiftsTemplate } = require("../models")

exports.findAllHrisUserAccount = async () => {
    return await HrisUserAccount.findAll({
        include: [
            {
                model: HrisUserInfo,
            },
            {
                model: HrisUserAddress,
            },
            {
                model: HrisUserEmergencyContact,
            },
            {
                model: HrisUserHr201,
            },
            {
                model: HrisUserSalary,
                include: HrisUserSalaryAdjustmentType,
            },
            {
                model: HrisUserEmploymentInfo,
                include: [
                    {
                        model: HrisUserJobLevel,
                    },
                    {
                        model: HrisUserEmploymentStatus
                    },
                    {
                        model: HrisUserEmploymentType
                    },
                ]
            },
            {
                model: HrisUserGovernmentId,
                include: HrisUserGovernmentIdType
            },
            {
                model: HrisUserDesignation,
                include: [
                    {
                        model: Company,
                        include: [
                            {
                                model: CompanyAddress,
                            },

                            {
                                model: CompanyInfo,
                                include: CompanyIndustry
                            },

                        ]
                    },
                    {
                        model: HrisUserShift,
                        include: HrisUserShiftsTemplate,
                    },
                    {
                        model: CompanyJobTitle
                    },
                    {
                        model: CompanyDepartment,
                    },
                    {
                        model: CompanyDivision
                    },
                    {
                        model: HrisUserAccount //for upline
                    },
                    {
                        model: CompanyOffice,
                    },
                    {
                        model: CompanyTeam,
                    }
                ]
            }
        ]
    });
}

exports.findHrisUserAccount = async (user_id) => {
    const hrisUserAccount = await HrisUserAccount.findOne({
        where: { user_id },
        include: [
            {
                model: HrisUserInfo,
            },
            {
                model: HrisUserAddress,
            },
            {
                model: HrisUserEmergencyContact,
            },
            {
                model: HrisUserHr201,
            },
            {
                model: HrisUserSalary,
                include: HrisUserSalaryAdjustmentType,
            },
            {
                model: HrisUserEmploymentInfo,
                include: [
                    {
                        model: HrisUserJobLevel,
                    },
                    {
                        model: HrisUserEmploymentStatus
                    },
                    {
                        model: HrisUserEmploymentType
                    },
                ]
            },
            {
                model: HrisUserGovernmentId,
                include: HrisUserGovernmentIdType
            },
            {
                model: HrisUserDesignation,
                include: [
                    {
                        model: Company,
                        include: [
                            {
                                model: CompanyAddress,
                            },

                            {
                                model: CompanyInfo,
                                include: CompanyIndustry
                            },

                        ]
                    },
                    {
                        model: HrisUserShift,
                        include: HrisUserShiftsTemplate,
                    },
                    {
                        model: CompanyJobTitle
                    },
                    {
                        model: CompanyDepartment,
                    },
                    {
                        model: CompanyDivision
                    },
                    {
                        model: HrisUserAccount //for upline
                    },
                    {
                        model: CompanyOffice,
                    },
                    {
                        model: CompanyTeam,
                    }
                ]
            }
        ]
    });

    if (!hrisUserAccount) throw new Error(`No user found with the user_id: ${user_id}`);

    return hrisUserAccount;
}

exports.findAllHrisUserAccountViaSearcyQuery = async (query) => {
    return await HrisUserAccount.findAll({
        where: {
            [Op.or]: [
                {
                    user_email: {
                        [Op.like]: `%${query}%`,
                    }
                },
                {
                    '$HrisUserInfo.first_name$': {
                        [Op.like]: `%${query}%`,
                    }
                },
                {
                    '$HrisUserInfo.last_name$': {
                        [Op.like]: `%${query}%`,
                    }
                }
            ]
        },
        include: [
            {
                model: HrisUserInfo,
                required: true // IMPORTANT for the $field$ syntax to work
            },
            {
                model: HrisUserAddress,
            },
            {
                model: HrisUserEmergencyContact,
            },
            {
                model: HrisUserHr201,
            },
            {
                model: HrisUserSalary,
                include: HrisUserSalaryAdjustmentType,
            },
            {
                model: HrisUserEmploymentInfo,
                include: [
                    { model: HrisUserJobLevel },
                    { model: HrisUserEmploymentStatus },
                    { model: HrisUserEmploymentType }
                ]
            },
            {
                model: HrisUserGovernmentId,
                include: HrisUserGovernmentIdType
            },
            {
                model: HrisUserDesignation,
                include: [
                    {
                        model: Company,
                        include: [
                            { model: CompanyAddress },
                            {
                                model: CompanyInfo,
                                include: CompanyIndustry
                            }
                        ]
                    },
                    {
                        model: HrisUserShift,
                        include: HrisUserShiftsTemplate
                    },
                    { model: CompanyJobTitle },
                    { model: CompanyDepartment },
                    { model: CompanyDivision },
                    { model: HrisUserAccount }, // for upline
                    { model: CompanyOffice },
                    { model: CompanyTeam }
                ]
            }
        ]
    });
};

exports.findUserByEmail = async (user_email) => {
    return await HrisUserAccount.findOne({
        where: { user_email }
    });
}

exports.createHrisUserAccount = async () => {
    return
}

