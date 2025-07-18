const companyOfficeService = require('../../services/company-services/company-office.service');

exports.getAll = async (req, res) => {
    const { company_id } = req.params;

    try {
        const offices = await companyOfficeService.findAll(company_id);
        return res.status(200).json({ message: "Fetched successfully", offices });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.getOne = async (req, res) => {
    const { office_id } = req.params;

    try {
        const office = await companyOfficeService.findOne(office_id);
        return res.status(200).json({ message: "Fetched successfully", office });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    const { company_id } = req.params;
    const { office_name, office_address } = req.body;

    if ([company_id, office_name, office_address].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const office = await companyOfficeService.create(company_id, office_name, office_address);
        return res.status(201).json({ message: "created successfully", office });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    const { company_id, office_id } = req.params;
    const { office_name, office_address } = req.body;

    if ([company_id, office_id, office_name, office_address].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const office = await companyOfficeService.update(office_id, office_name, office_address);
        return res.status(200).json({ message: "updated successfully", office });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    const { office_id } = req.params;

    if ([office_id].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const office = await companyOfficeService.delete(office_id);
        return res.status(200).json({ message: "Deleted successfully", office })
    } catch (error) {
        return res.status(500).json({ message: error.message, error: error.message });
    }
};