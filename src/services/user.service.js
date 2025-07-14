const { Op } = require("sequelize");
const { HrisUserAccount, HrisUserInfo, HrisUserAddress, HrisUserEmergencyContact, HrisUserEmploymentInfo, HrisUserDesignation, HrisUserShift, HrisShiftsTemplate, HrisUserSalary, Company, CompanyAddress, CompanyDepartment, CompanyDivision, CompanyInfo, CompanyJobTitle, CompanyIndustry } = require("../models")

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
                model: HrisUserEmploymentInfo,
            },
            {
                model: HrisUserSalary,
            },
            {
                model: HrisUserDesignation, //how about the upline id here? 
                include: [
                    {
                        model: Company,
                        include: [
                            {
                                model: CompanyAddress,
                            },

                            {
                                model: CompanyInfo,
                                include: [
                                    {
                                        model: CompanyIndustry,
                                    }
                                ]
                            },

                        ]
                    },
                    {
                        model: HrisUserShift,
                        include: [
                            {
                                model: HrisShiftsTemplate,
                            },
                        ]
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
                        model: HrisUserAccount
                    }
                ]
            }
        ]
    });
}

exports.findHrisUserAccount = async (user_id) => {
    const hrisUserAccount = await HrisUserAccount.findAll({
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
                model: HrisUserEmploymentInfo,
            },
            {
                model: HrisUserSalary,
            },
            {
                model: HrisUserDesignation, //how about the upline id here? 
                include: [
                    {
                        model: Company,
                        include: [
                            {
                                model: CompanyAddress,
                            },

                            {
                                model: CompanyInfo,
                                include: [
                                    {
                                        model: CompanyIndustry,
                                    }
                                ]
                            },

                        ]
                    },
                    {
                        model: HrisUserShift,
                        include: [
                            {
                                model: HrisShiftsTemplate,
                            },
                        ]
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
                        model: HrisUserAccount
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
            [Op.or]: [{ user_email: `%${query}%` }]
        },
        include: [
            {
                model: HrisUserInfo,
                where: {
                    [Op.or]: [
                        { first_name: `%${query}%` },
                        { last_name: `%${query}%` },
                    ]
                }
            },
            {
                model: HrisUserAddress,
            },
            {
                model: HrisUserEmergencyContact,
            },
            {
                model: HrisUserEmploymentInfo,
            },
            {
                model: HrisUserSalary,
            },
            {
                model: HrisUserDesignation, //how about the upline id here? 
                include: [
                    {
                        model: Company,
                        include: [
                            {
                                model: CompanyAddress,
                            },

                            {
                                model: CompanyInfo,
                                include: [
                                    {
                                        model: CompanyIndustry,
                                    }
                                ]
                            },

                        ]
                    },
                    {
                        model: HrisUserShift,
                        include: [
                            {
                                model: HrisShiftsTemplate,
                            },
                        ]
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
                        model: HrisUserAccount
                    }
                ]
            }
        ]
    })
}

exports.findUserByEmail = async (user_email) => {
    return await HrisUserAccount.findOne({
        where: { user_email }
    });
}

exports.createHrisUserAccount = async () => {
    return
}

