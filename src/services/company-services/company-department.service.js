const { CompanyDepartment } = require("../../models");
const { getIsoUTCNow, getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async (company_id) => {
    return await CompanyDepartment.findAll({
        where: { company_id },
        order: [['department_name', 'ASC']]
    });
};

exports.findOne = async (department_id) => {
    const department = await CompanyDepartment.findByPk(department_id);

    if (!department) throw new Error('no department found');

    return department
};

exports.create = async (company_id, department_name) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();
    return await CompanyDepartment.create({
        department_id: generateUUIV4(),
        company_id,
        department_name,
        created_at,
        updated_at
    });
};

exports.update = async (department_id, department_name) => {
    const department = await CompanyDepartment.findByPk(department_id);

    if (!department) throw new Error("No department found");

    department.set({
        department_name,
        updated_at: getIsoUTCNow(),
    });

    await department.save();
    return department;
};

exports.delete = async (departmentId) => {
    const department = await CompanyDepartment.findByPk(departmentId);

    if (!department) throw new Error("No department found");

    await department.destroy();
    return department;
};

