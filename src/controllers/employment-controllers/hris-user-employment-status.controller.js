const hrisUserEmploymentStatusService = require("../../services/employment-services/hris-user-employment-status.service");

exports.getAll = async (req, res) => {
    try {
        const statuses = await hrisUserEmploymentStatusService.findAll();
        return res.status(200).json({ message: "Fetched successfully", statuses });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.create = async (req, res) => {
    const { employment_status } = req.body;

    try {
        const status = await hrisUserEmploymentStatusService.create(employment_status);
        return res.status(201).json({ message: "Created successfully", status });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}