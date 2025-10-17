const {
  Company,
  CompanyAddress,
  CompanyDepartment,
  CompanyDivision,
  CompanyInfo,
  CompanyIndustry,
  CompanyJobTitle,
  CompanyTeam,
  CompanyOffice,
} = require("../../models");

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
      },
    ],
  });
};
exports.findOneCompany = async (company_id) => {
  const company = await Company.findOne({
    where: { company_id },
    attributes: ["company_id", "company_email", "status", "date_added"],

    include: [
      {
        model: CompanyInfo,
        attributes: [
          "company_info_id",
          "company_id",
          "industry_id",
          "industry_type",
          "business_type",
          "company_name",
          "company_trade_name",
          "company_phone",
          "company_brn",
          "company_tin",
          "employee_count",
          "company_logo",
        ],
        include: [
          {
            model: CompanyIndustry,
            attributes: [
              "industry_id",
              "industry_type",
              "created_at",
              "updated_at",
            ],
          },
        ],
      },
      {
        model: CompanyAddress,
        attributes: [
          "company_addresses_id",
          "company_id",
          "address_type",
          "floor_bldg_street",
          "barangay",
          "city_municipality",
          "postal_code",
          "province_region",
          "country",
        ],
      },
    ],
  });

  if (!company) throw new Error("No companies found");

  return company;
};


exports.updateCompanyDetails = async (company_id, updateData) => {
  const companyInfoFields = [
    "company_name",
    "company_trade_name",
    "business_type",
    "industry_type",
    "company_phone",
    "company_brn",
    "company_tin",
    "employee_count",
    "company_logo",
    "industry_id",
  ];

  const addressFields = [
    "floor_bldg_street",
    "barangay",
    "city_municipality",
    "postal_code",
    "province_region",
    "country",
  ];

  const companyFields = ["company_email", "status"];

  const companyInfoData = {};
  const addressData = {};
  const companyData = {};

  for (const key in updateData) {
    if (companyInfoFields.includes(key)) companyInfoData[key] = updateData[key];
    else if (addressFields.includes(key)) addressData[key] = updateData[key];
    else if (companyFields.includes(key)) companyData[key] = updateData[key];
  }

  const companyInfo = await CompanyInfo.findOne({ where: { company_id } });
  if (!companyInfo) throw new Error("Company info not found");
  await companyInfo.update(companyInfoData);

  let companyAddress = await CompanyAddress.findOne({
    where: { company_id },
  });

  if (!companyAddress) {
    companyAddress = await CompanyAddress.create({
      company_id,
      address_type: "MAIN",
      ...addressData,
    });
  } else {
    await companyAddress.update(addressData);
  }

  const company = await Company.findOne({ where: { company_id } });
  if (!company) throw new Error("Company not found");
  await company.update(companyData);

  return {
    companyInfo,
    companyAddress,
    company,
  };
};
