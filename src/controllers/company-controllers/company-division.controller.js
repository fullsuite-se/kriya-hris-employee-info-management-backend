const companyDivisionService = require("../../services/company-services/company-division.service");

exports.getAll = async (req, res) => {
    const { company_id } = req.params;

    try {
        const divisions = await companyDivisionService.findAll(company_id);
        return res.status(200).json({ message: "fetched successfully", divisions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getOne = async (req, res) => {
    const { division_id } = req.params;
    try {
        const division = await companyDivisionService.findOne(division_id);
        return res.status(200).json({ message: "fetched successfully", division });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    const { company_id } = req.params;
    const { division_name } = req.body;

    try {
        const division = await companyDivisionService.create(company_id, division_name);
        return res.status(201).json({ message: "created successfully", division });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    const { division_id } = req.params;
    const { division_name } = req.body;

    try {
        const division = await companyDivisionService.update(division_id, division_name);
        return res.status(201).json({ message: "updated successfully", division });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    const { division_id } = req.params;

    try {
        const division = await companyDivisionService.delete(division_id);
        return res.status(201).json({ message: "deleted successfully", division });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};