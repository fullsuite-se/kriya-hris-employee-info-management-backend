const { HrisUserAccessPermission, ServiceFeature } = require("../../models");
const { getIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

//get access features permission of user
exports.getUserAccessPermissions = async (user_id) => {
    const accessPermissionsRaw = await HrisUserAccessPermission.findAll({ where: { user_id }, include: ServiceFeature });

    return accessPermissionsRaw.map(accessPermission => ({
        user_access_permission_id: accessPermission.user_access_permission_id,
        service_feature_id: accessPermission.service_feature_id,
        feature_name: accessPermission.ServiceFeature?.feature_name,
    }));
}

//add access feature permission for user
exports.addUserAccessPermissions = async (user_id, service_feature_ids) => {
    const created_at = getIsoUTCNow();

    const accessPermissionsData = service_feature_ids.map(service_feature_id => ({
        user_access_permission_id: generateUUIV4(),
        user_id,
        service_feature_id,
        created_at,
    }));

    const accessPermissions = await HrisUserAccessPermission.bulkCreate(accessPermissionsData);
    return accessPermissions;
}

//delete access feature permission for user
exports.deleteUserAccessPermissions = async (user_id) => {
  await HrisUserAccessPermission.destroy({
    where: { user_id }
  });

  return;
};
