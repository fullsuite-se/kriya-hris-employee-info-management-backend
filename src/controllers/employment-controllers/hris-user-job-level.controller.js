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


exports.update = async (req, res) => {
    const { job_level_id } = req.params;
    const { job_level_name, job_level_description } = req.body;
    try {
        const level = await hrisUserJobLevelService.update(job_level_id, job_level_name, job_level_description)

        return res.status(200).json({ message: "Updated successfully", level })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.delete = async (req, res) => {
    const { job_level_id } = req.params;

    try {
        const level = await hrisUserJobLevelService.delete(job_level_id);
        return res.status(200).json({ message: "Deleted successfully", level })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};