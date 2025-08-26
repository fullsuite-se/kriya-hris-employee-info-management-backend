const {
  findAllCompanies,
  findOneCompany,
  updateCompanyDetails,
} = require("../../services/company-services/company.service");

exports.getCompanies = async (req, res) => {
  try {
    const companies = await findAllCompanies();
    return res
      .status(200)
      .json({ message: "Successfully fetched companies", companies });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch companies", error: error.message });
  }
};

exports.getCompany = async (req, res) => {
  const { company_id } = req.params;

  if (!company_id)
    return res
      .status(400)
      .json({ message: "The client sent a malformed or incomplete request" });

  try {
    const companies = await findOneCompany(company_id);
    return res
      .status(200)
      .json({ message: "Successfully fetched companies", companies });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch companies", error: error.message });
  }
};

exports.updateCompanyDetails = async (req, res) => {
  const { company_id } = req.params;
  const updateData = req.body;

  if (!company_id)
    return res
      .status(400)
      .json({ message: "The client sent a malformed or incomplete request" });

  try {
    const updatedCompanyDetails = await updateCompanyDetails(
      company_id,
      updateData
    );

    return res.status(200).json({
      message: "Successfully updated company Details",
      updatedCompanyDetails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update company Details", error: error.message });
  }
};
