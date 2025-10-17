const companyEmployerService = require('../../services/company-services/company-employer.service');

exports.getAll = async (req, res) => {

    try {
        const company_employers = await companyEmployerService.findAll();
        return res.status(200).json({ message: "Fetched successfully", company_employers });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.getOne = async (req, res) => {
    const { company_employer_id } = req.params;

    try {
        const company_employer = await companyEmployerService.findOne(company_employer_id);
        return res.status(200).json({ message: "Fetched successfully", company_employer });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    const { company_employer_name } = req.body;

    if ([company_employer_name].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const company_employer = await companyEmployerService.create(company_employer_id, company_employer_name);
        return res.status(201).json({ message: "created successfully", company_employer });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    const { company_employer_id, company_employer_name } = req.body;

    if ([company_employer_id, company_employer_name].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const company_employer = await companyEmployerService.update(company_employer_id, company_employer_name);
        return res.status(200).json({ message: "updated successfully", company_employer });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    const { company_employer_id } = req.params;

    if ([company_employer_id].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const company_employer = await companyEmployerService.delete(company_employer_id);
        return res.status(200).json({ message: "Deleted successfully", company_employer })
    } catch (error) {
        return res.status(500).json({ message: error.message, error: error.message });
    }
};