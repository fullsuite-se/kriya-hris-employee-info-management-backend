const { Company, CompanyAddress, CompanyDepartment, CompanyDivision, CompanyInfo, CompanyIndustry, CompanyJobTitle, CompanyTeam, CompanyOffice } = require("../models")

exports.findAllCompanies = async () => {
    return await Company.findAll({
        include: [
            {
                model: CompanyInfo,
                include: CompanyIndustry,
            },
            {
                model: CompanyAddress,
            },
            {
                model: CompanyDepartment,
            },
            {
                model: CompanyDivision,
            },
            {
                model: CompanyJobTitle,
            },
            {
                model: CompanyTeam,
            },
            {
                model: CompanyOffice,
            }
        ]
    });
}

exports.findOneCompany = async (company_id) => {
    const companies = await Company.findOne({
        where: {
            company_id: company_id,
        },
        include: [
            {
                model: CompanyInfo,
                include: CompanyIndustry,
            },
            {
                model: CompanyAddress,
            },
            {
                model: CompanyDepartment,
            },
            {
                model: CompanyDivision,
            },
            {
                model: CompanyJobTitle,
            },
            {
                model: CompanyTeam,
            },
            {
                model: CompanyOffice,
            }
        ]
    });

    if (!companies) throw new Error("No companies found");

    return companies;
}