// const companyTeamService = require('../../services/company-service/company-team.service');
const companyTeamService = require('../../services/company-services/company-team.service');

exports.create = async (req, res) => {
    const { company_id } = req.params;
    const { team_name, team_description } = req.body;

    if ([company_id, team_name, team_description].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const team = await companyTeamService.create(company_id, team_name, team_description);
        return res.status(201).json({ message: "Team created", team });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getAll = async (req, res) => {
    const { company_id } = req.params;
    if ([company_id].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const teams = await companyTeamService.findAll(company_id);
        return res.status(200).json({ message: "Successfully fetched", teams })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getOne = async (req, res) => {
    const { team_id } = req.params;
    if ([team_id].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const team = await companyTeamService.findOne(team_id);
        res.status(200).json({ message: "Successfully fetched", team })
    } catch (error) {
        return res.status(500).json({ message: "", error: error.message });
    }
};

exports.update = async (req, res) => {
    const { company_id, team_id } = req.params;
    const { team_name, team_description } = req.body;

    if ([company_id, team_id, team_name, team_description].some(v => !v)) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const team = await companyTeamService.update(team_id, company_id, team_name, team_description);
        return res.status(200).json({ message: "Updated successfully", team });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    const { team_id } = req.params;
    try {
        const team = await companyTeamService.delete(team_id);
        return res.status(200).json({ message: "deleted successfully", team });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};