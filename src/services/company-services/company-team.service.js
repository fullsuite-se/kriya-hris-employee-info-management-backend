const { CompanyTeam } = require('../../models');
const { getIsoUTCNow, getCreatedUpdatedIsoUTCNow } = require('../../utils/date');
const { generateUUIV4 } = require('../../utils/ids');

exports.create = async (company_id, team_name, team_description) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    const team = await CompanyTeam.create({
        team_id: generateUUIV4(),
        company_id,
        team_name,
        team_description,
        created_at,
        updated_at
    });

    return team;
};

exports.findAll = async (company_id) => {
    const teams = await CompanyTeam.findAll({
        where: { company_id },
        order: [['team_name', 'ASC']]
    });

    return teams;
};

exports.findOne = async (team_id) => {
    const team = await CompanyTeam.findByPk(team_id);
    if (!team) throw new Error('No team found');
    return team;
};

exports.update = async (team_id, company_id, team_name, team_description) => {

    const team = await CompanyTeam.findByPk(team_id);

    if (!team) throw new Error("No team found");

    team.set({
        team_name,
        team_description,
        updated_at: getIsoUTCNow(),
    });

    team.save();
    return team;
};


exports.delete = async (team_id) => {
    const team = await CompanyTeam.findByPk(team_id);
    if (!team) throw new Error('No team found');

    team.destroy();
    team.save();

    return team;
};