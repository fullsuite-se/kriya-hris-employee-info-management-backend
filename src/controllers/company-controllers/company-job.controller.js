const companyJobTitleService = require("../../services/company-services/company-job.service");

exports.getAll = async (req, res) => {
    const { company_id } = req.params;

    try {
        const jobs = await companyJobTitleService.findAll(company_id);
        return res.status(200).json({ message: "fetched successfully", jobs })
    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
};

exports.getOne = async (req, res) => {
    const { job_title_id } = req.params;
    try {
        const job = await companyJobTitleService.findOne(job_title_id);
        return res.status(200).json({ message: "fetched successfully", job })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    const { company_id } = req.params;
    const { job_title } = req.body;

    try {
        const job = await companyJobTitleService.create(company_id, job_title);
        return res.status(201).json({ message: "Created successuflly", job })
    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
};

exports.update = async (req, res) => {
    const { job_title_id } = req.params;
    const { job_title } = req.body;

    try {
        const job = await companyJobTitleService.update(job_title_id, job_title)

        return res.status(200).json({ message: "Updated successuflly", job })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    const { job_title_id } = req.params;

    try {
        const job = await companyJobTitleService.delete(job_title_id);
        return res.status(200).json({ message: "Deleted successuflly", job })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};