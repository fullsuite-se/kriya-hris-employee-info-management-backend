const { HrisUserAccount, HrisUserInfo, HrisUserAddress, HrisUserEmergencyContact, HrisUserEmploymentInfo, HrisUserDesignation, HrisUserShift, HrisShiftsTemplate, HrisUserSalary, Company, CompanyAddress, CompanyDepartment, CompanyDivision, CompanyInfo, CompanyJobTitle, CompanyIndustry } = require("../models")

exports.findAllHrisUserAccount = async () => {
    // return await HrisUserAccount.findAll({
    //     include: [
    //         {
    //             model: HrisUserInfo,
    //         },
    //         {
    //             model: HrisUserAddress,
    //         },
    //         {
    //             model: HrisUserEmergencyContact,
    //         },
    //         {
    //             model: HrisUserEmploymentInfo,
    //         },
    //         {
    //             model: HrisUserSalary,
    //         },
    //         {
    //             model: HrisUserDesignation, //how about the upline id here? 
    //             include: [
    //                 {
    //                     model: Company,
    //                     include: [
    //                         {
    //                             model: CompanyAddress,
    //                         },

    //                         {
    //                             model: CompanyInfo,
    //                             include: [
    //                                 {
    //                                     model: CompanyIndustry,
    //                                 }
    //                             ]
    //                         },

    //                     ]
    //                 },
    //                 {
    //                     model: HrisUserShift,
    //                     include: [
    //                         {
    //                             model: HrisShiftsTemplate,
    //                         },
    //                     ]
    //                 },
    //                 {
    //                     model: CompanyJobTitle
    //                 },
    //                 {
    //                     model: CompanyDepartment,
    //                 },
    //                 {
    //                     model: CompanyDivision
    //                 },
    //                 {
    //                     model: HrisUserAccount
    //                 }
    //             ]
    //         }
    //     ]
    // });

    return await HrisUserDesignation.findAll({
        include: [
            {
                model: HrisUserAccount,
            }
        ]
    })
}

exports.findHrisUserAccount = async (user_id) => {
    return await HrisUserAccount.findAll({
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
}



exports.createHrisUserAccount = async () => {

}   