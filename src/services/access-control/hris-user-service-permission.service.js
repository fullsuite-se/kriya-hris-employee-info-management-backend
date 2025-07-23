const { HrisUserServicePermission, Service } = require("../../models");
const { getIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

//get user-service permission of user
exports.getUserServicePermission = async (user_id) => {
    const servicePermissionsRaw = await HrisUserServicePermission.findAll({ where: { user_id }, include: Service });

    return servicePermissionsRaw.map(servicePermission => ({
        user_service_permission_id: servicePermission.user_service_permission_id,
        service_id: servicePermission.service_id,
        service_name: servicePermission.Service?.service_name,
    }));
}

//add user-service permission for user
exports.addUserServicePermission = async (user_id, service_ids) => {
    const created_at = getIsoUTCNow();
    const servicePermissionsData = service_ids.map(service_id => ({
        user_service_permission_id: generateUUIV4(),
        user_id,
        service_id,
        created_at,
    }));

    const servicePermissions = await HrisUserServicePermission.bulkCreate(servicePermissionsData);
    return servicePermissions;
}

//delete user-service permission for user
exports.deleteUserServicePermission = async (user_service_permission_ids) => {
    for (const user_service_permission_id of user_service_permission_ids) {
        const servicePermission = await HrisUserServicePermission.findByPk(user_service_permission_id);
        if (!servicePermission) throw new Error("No service permission found");

        servicePermission.destroy();
        return;
    }
}