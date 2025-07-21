const { HrisUserEmploymentInfo } = require("../../models")

exports.findOne = async (user_id) => {

    const employment = await HrisUserEmploymentInfo.findOne({
        where: { user_id }
    });

    if (!employment) throw new Error("No employement found");

    return employment;
}

exports.update = async (
    user_id,
    shift_template_id,
    date_hired,
    date_regularization,
    date_offboarding,
    date_separated,
    employment_status_id,
    job_level_id,
    employment_type_id
) => {

    const employment = await HrisUserEmploymentInfo.findOne({ where: { user_id } });

    if (!employment) throw new Error("No employement info found");

    employment.set({
        shift_template_id,
        date_hired,
        date_regularization,
        date_offboarding,
        date_separated,
        employment_status_id,
        job_level_id,
        employment_type_id
    });
    employment.save();

    return employment;
}