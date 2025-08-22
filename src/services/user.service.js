const { Op } = require("sequelize");
const { HrisUserAccount, HrisUserInfo, HrisUserAddress, HrisUserEmergencyContact, HrisUserEmploymentInfo, HrisUserDesignation, HrisUserSalary, Company, CompanyAddress, CompanyDepartment, CompanyDivision, CompanyInfo, CompanyJobTitle, CompanyIndustry, HrisUserSalaryAdjustmentType, HrisUserJobLevel, HrisUserEmploymentStatus, HrisUserEmploymentType, HrisUserHr201, CompanyOffice, CompanyTeam, HrisUserGovernmentId, HrisUserGovernmentIdType, HrisUserShiftsTemplate, HrisUserAccessPermission, HrisUserServicePermission } = require("../models");
const sequelize = require("../config/db");

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
                    {
                        model: HrisUserShiftsTemplate
                    }
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
                    {
                        model: HrisUserShiftsTemplate
                    }
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
                            }
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

// exports.findHrisUserAccountBasicInfo = async (user_id) => {
//     const hrisUserAccount = await HrisUserAccount.findOne({
//         where: { user_id },
//         include: HrisUserInfo,
//         raw: true,
//         nest: false,
//     });

//     if (!hrisUserAccount) throw new Error(`No user found with the user_id: ${user_id}`);

//     return hrisUserAccount;
// }


// exports.findHrisUserAccountBasicInfo = async (user_id) => {
//     const hrisUserInfo = await HrisUserInfo.findOne({
//         attributes: ['user_id', 'first_name', 'last_name', 'user_pic', 'contact_number'],
//         where: { user_id },
//     });

//     if (!hrisUserInfo) throw new Error(`No user found with the user_id: ${user_id}`);

//     return hrisUserInfo;
// }

exports.findHrisUserAccountBasicInfo = async (user_id) => {
    const hrisUserInfo = await HrisUserInfo.findOne({
        attributes: [
            'user_id',
            'first_name',
            'last_name',
            'user_pic',
            'contact_number',
            [
                sequelize.literal(`(
          SELECT user_email 
          FROM hris_user_accounts 
          WHERE hris_user_accounts.user_id = HrisUserInfo.user_id
        )`),
                'user_email'
            ]
        ],
        where: { user_id },
        raw: true
    });

    if (!hrisUserInfo) throw new Error(`No user found with the user_id: ${user_id}`);

    return hrisUserInfo;
};



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
                    { model: HrisUserEmploymentType },
                    {
                        model: HrisUserShiftsTemplate
                    }
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
        where: { user_email },
        include: {
            model: HrisUserDesignation,
            include: Company
        }
    });
}

exports.createHrisUserAccount = async (
    hrisUserAccountData,
    hrisUserInfoData,
    hrisUserDesignationData,
    hrisUserSalaryData,
    hrisUserAddressCurrentData,
    hrisUserAddressPermanentData,
    hrisUserHr201Data,
    hrisUserEmploymentInfoData,
    hrisUserGovernmentIdData,
    hrisUserEmergencyContactData
) => {
    return await sequelize.transaction(async (t) => {
        const hrisUserAccount = await HrisUserAccount.create(
            hrisUserAccountData,
            { transaction: t }
        );

        const hrisUserInfo = await HrisUserInfo.create(
            hrisUserInfoData,
            { transaction: t }
        );

        const hrisUserDesignation = await HrisUserDesignation.create(
            hrisUserDesignationData,
            { transaction: t }
        );

        const hrisUserSalary = await HrisUserSalary.create(
            hrisUserSalaryData,
            { transaction: t }
        );


        //PERMANENT ADDRESS
        const hrisUserAddressPermanent = await HrisUserAddress.create(
            hrisUserAddressPermanentData,
            { transaction: t }
        );

        //CURRENT ADDRESS
        const hrisUserAddressCurrent = await HrisUserAddress.create(
            hrisUserAddressCurrentData,
            { transaction: t }
        );


        const hrisUserHr201 = await HrisUserHr201.create(
            hrisUserHr201Data,
            { transaction: t }
        )

        const hrisUserEmploymentInfo = await HrisUserEmploymentInfo.create(
            hrisUserEmploymentInfoData,
            { transaction: t }
        );

        //governement ID/contribution
        const hrisUserGovernmentId = await HrisUserGovernmentId.bulkCreate(
            hrisUserGovernmentIdData,
            { transaction: t },
        )

        //emergency contacts
        const hrisUserEmergencyContact = await HrisUserEmergencyContact.bulkCreate(
            hrisUserEmergencyContactData,
            { transaction: t },
        );


        return {
            hrisUserAccount,
            hrisUserInfo,
            hrisUserDesignation,
            hrisUserSalary,
            hrisUserAddressPermanent,
            hrisUserAddressCurrent,
            hrisUserHr201,
            hrisUserEmploymentInfo,
            hrisUserGovernmentId,
            hrisUserEmergencyContact,
        };
    });
}


exports.findAllHrisUserAccountViaServiceFeatureAccess = async (service_feature_id) => {
    return await HrisUserAccount.findAll({
        include: [
            {
                model: HrisUserInfo,
                required: true
            },
            {
                model: HrisUserAccessPermission,
                required: true,
                where: {
                    service_feature_id
                }
            }
        ]
    });
};


exports.findAllHrisUserAccountViaServiceAccess = async (service_id) => {
    return await HrisUserAccount.findAll({
        include: [
            {
                model: HrisUserInfo,
                required: true
            },
            {
                model: HrisUserServicePermission,
                required: true,
                where: {
                    service_id
                }
            }
        ]
    });
};


