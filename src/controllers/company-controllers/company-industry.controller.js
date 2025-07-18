const companyIndustryService = require("../../services/company-services/company-industry.service");

exports.getAll = async (req, res) => {
    try {
        const industries = await companyIndustryService.findAll();
        return res.status(200).json({ message: "fetched successfully", industries });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { industry_type } = req.body;

        const industry = await companyIndustryService.create(industry_type);
        return res.status(201).json({ message: "Created successfully", industry });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { industry_id } = req.params;
        const { industry_type } = req.body;

        const industry = await companyIndustryService.update(industry_id, industry_type);
        return res.status(200).json({ message: "fetched successfully", industry });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { industry_id } = req.params;

        const industry = await companyIndustryService.delete(industry_id);
        return res.status(200).json({ message: "Deleted successfully", industry });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};