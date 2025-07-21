const hrisUserJobLevelService = require("../../services/employment-services/hris-user-job-level.service");

exports.getAll = async (req, res) => {
    try {
        const levels = await hrisUserJobLevelService.findAll();
        return res.status(200).json({ message: "Fetched successfully", levels })
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.create = async (req, res) => {
    const { job_level_name, job_level_description } = req.body;
    try {
        const level = await hrisUserJobLevelService.create(job_level_name, job_level_description);
        return res.status(201).json({ message: "Created successfully", level });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}