const { Op } = require("sequelize");
const {
  HrisUserAccount,
  HrisUserServicePermission,
  Service,
  HrisUserInfo,
  HrisUserAccessPermission,
  ServiceFeature
} = require("../../models");

exports.findAllUsersWithPermissions = async (
  serviceIds = null,
  serviceFeatureIds = null,
  { offset = 0, limit = 10 } = {},
  searchFilter = null
) => {
  try {
    // STEP 1: Get all service_ids in HrisUserServicePermission 
    const servicePermissions = await HrisUserServicePermission.findAll({
      attributes: ["user_id", "service_id"],
      include: [{ model: Service, attributes: ["service_name"], required: true }],
      raw: true
    });

    const userIds = [...new Set(servicePermissions.map(sp => sp.user_id))];

    //  STEP 2: Prepare global counts (always computed) 
    const allServices = await Service.findAll({ attributes: ["service_id", "service_name"], raw: true });
    const globalCounts = { allCount: userIds.length };
    allServices.forEach(s => { globalCounts[`${s.service_name.toLowerCase()}Count`] = 0; });
    servicePermissions.forEach(sp => {
      if (userIds.includes(sp.user_id)) {
        const key = `${sp["Service.service_name"].toLowerCase()}Count`;
        if (globalCounts[key] !== undefined) globalCounts[key] += 1;
      }
    });

    // If no users at all, return early but with global counts
    if (userIds.length === 0) {
      return { users: [], counts: { ...globalCounts, length: 0 } };
    }

    //  STEP 3: Build search condition 
    let searchCondition = {};
    if (searchFilter && searchFilter.trim()) {
      const searchTerm = searchFilter.trim();
      const searchParts = searchTerm.split(/\s+/).filter(part => part.length > 0);

      if (searchParts.length > 1) {
        const searchConditions = [];

        if (searchParts.length === 2) {
          searchConditions.push(
            {
              [Op.and]: [
                { first_name: { [Op.like]: `%${searchParts[0]}%` } },
                { last_name: { [Op.like]: `%${searchParts[1]}%` } }
              ]
            },
            {
              [Op.and]: [
                { first_name: { [Op.like]: `%${searchParts[1]}%` } },
                { last_name: { [Op.like]: `%${searchParts[0]}%` } }
              ]
            }
          );
        } else if (searchParts.length >= 3) {
          searchConditions.push(
            {
              [Op.and]: [
                { first_name: { [Op.like]: `%${searchParts[0]}%` } },
                { last_name: { [Op.like]: `%${searchParts[searchParts.length - 1]}%` } }
              ]
            },
            {
              [Op.and]: [
                { first_name: { [Op.like]: `%${searchParts[searchParts.length - 1]}%` } },
                { last_name: { [Op.like]: `%${searchParts[0]}%` } }
              ]
            }
          );
        }

        searchParts.forEach(part => {
          searchConditions.push({
            [Op.or]: [
              { first_name: { [Op.like]: `%${part}%` } },
              { middle_name: { [Op.like]: `%${part}%` } },
              { last_name: { [Op.like]: `%${part}%` } },
              { extension_name: { [Op.like]: `%${part}%` } },
              { user_id: { [Op.like]: `%${part}%` } }
            ]
          });
        });

        searchCondition = { [Op.or]: searchConditions };
      } else {
        searchCondition = {
          [Op.or]: [
            { first_name: { [Op.like]: `%${searchTerm}%` } },
            { middle_name: { [Op.like]: `%${searchTerm}%` } },
            { last_name: { [Op.like]: `%${searchTerm}%` } },
            { extension_name: { [Op.like]: `%${searchTerm}%` } },
            { user_id: { [Op.like]: `%${searchTerm}%` } }
          ]
        };
      }
    }


    //  STEP 4: Apply search filter 
    const userInfos = await HrisUserInfo.findAll({
      where: { user_id: { [Op.in]: userIds }, ...searchCondition },
      raw: true
    });

    let filteredUserIds = userInfos.map(ui => ui.user_id);

    // If no filtered users, still return with global counts
    if (filteredUserIds.length === 0) {
      return { users: [], counts: { ...globalCounts, length: 0 } };
    }

    //  STEP 5: Apply service filter 
    if (serviceIds && serviceIds.length > 0) {
      filteredUserIds = [...new Set(
        servicePermissions
          .filter(sp => serviceIds.includes(sp.service_id) && filteredUserIds.includes(sp.user_id))
          .map(sp => sp.user_id)
      )];
    }

    //  STEP 6: Apply feature filter 
    if (serviceFeatureIds && serviceFeatureIds.length > 0) {
      const featurePermissions = await HrisUserAccessPermission.findAll({
        where: { user_id: { [Op.in]: filteredUserIds }, service_feature_id: { [Op.in]: serviceFeatureIds } },
        attributes: ["user_id"],
        raw: true
      });
      filteredUserIds = [...new Set(featurePermissions.map(fp => fp.user_id))];
    }

    if (filteredUserIds.length === 0) {
      return { users: [], counts: { ...globalCounts, length: 0 } };
    }

    //  STEP 7: Sort + paginate 
    const sortedUsersInfo = await HrisUserInfo.findAll({
      where: { user_id: { [Op.in]: filteredUserIds } },
      attributes: ["user_id", "first_name", "last_name"],
      order: [["last_name", "ASC"], ["first_name", "ASC"]],
      raw: true
    });

    const sortedUserIds = sortedUsersInfo.map(u => u.user_id);
    const paginatedUserIds = sortedUserIds.slice(offset, offset + limit);

    //  STEP 8: Fetch final users 
    const users = await HrisUserAccount.findAll({
      attributes: ["user_id", "user_email"],
      include: [
        { model: HrisUserInfo, attributes: ["first_name", "middle_name", "last_name", "extension_name", "user_pic"], required: true },
        { model: HrisUserServicePermission, attributes: ["service_id"], include: [{ model: Service, attributes: ["service_name"], required: true }], required: true },
        { model: HrisUserAccessPermission, attributes: ["service_feature_id"], include: [{ model: ServiceFeature, attributes: ["feature_name"], required: true }], required: false },
      ],
      where: { user_id: { [Op.in]: paginatedUserIds } },
      order: [
        [{ model: HrisUserInfo }, "last_name", "ASC"],
        [{ model: HrisUserInfo }, "first_name", "ASC"]
      ],
    });

    return { users, counts: { ...globalCounts, length: filteredUserIds.length } };
  } catch (error) {
    console.error("Error in findAllUsersWithPermissions:", error);
    throw error;
  }
};
