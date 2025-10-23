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
    // STEP 1: Get all service permissions (with service names)
    const servicePermissions = await HrisUserServicePermission.findAll({
      attributes: ["user_id", "service_id"],
      include: [{
        model: Service,
        attributes: ["service_name"],
        required: true
      }],
      raw: true
    });

    // Extract unique user IDs and build service name map
    const userIds = [...new Set(servicePermissions.map(sp => sp.user_id))];
    const serviceNameMap = {};
    servicePermissions.forEach(sp => {
      serviceNameMap[sp.service_id] = sp["Service.service_name"];
    });

    // Build global counts from existing data (no extra Service query needed)
    const uniqueServices = [...new Set(Object.values(serviceNameMap))];
    const globalCounts = { allCount: userIds.length };
    uniqueServices.forEach(name => {
      globalCounts[`${name.toLowerCase()}Count`] = 0;
    });

    servicePermissions.forEach(sp => {
      const key = `${sp["Service.service_name"].toLowerCase()}Count`;
      if (globalCounts[key] !== undefined) globalCounts[key] += 1;
    }
    );

    if (userIds.length === 0) {
      return { users: [], counts: { ...globalCounts, length: 0 } };
    }

    // STEP 2: Build search condition
    let searchCondition = {};
    if (searchFilter?.trim()) {
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

    // STEP 3: Fetch user info ONCE with search filter and sorting
    const userInfos = await HrisUserInfo.findAll({
      where: {
        user_id: { [Op.in]: userIds },
        ...searchCondition
      },
      attributes: ["user_id", "first_name", "middle_name", "last_name", "extension_name", "user_pic"],
      order: [["last_name", "ASC"], ["first_name", "ASC"]],
      raw: true
    });

    if (userInfos.length === 0) {
      return { users: [], counts: { ...globalCounts, length: 0 } };
    }

    let filteredUserIds = userInfos.map(ui => ui.user_id);

    // STEP 4: Apply service filter (in-memory)
    if (serviceIds?.length > 0) {
      filteredUserIds = [...new Set(
        servicePermissions
          .filter(sp => serviceIds.includes(sp.service_id) && filteredUserIds.includes(sp.user_id))
          .map(sp => sp.user_id)
      )];
    }

    // STEP 5: Apply feature filter
    if (serviceFeatureIds?.length > 0) {
      const featurePermissions = await HrisUserAccessPermission.findAll({
        where: {
          user_id: { [Op.in]: filteredUserIds },
          service_feature_id: { [Op.in]: serviceFeatureIds }
        },
        attributes: ["user_id"],
        raw: true
      });
      filteredUserIds = [...new Set(featurePermissions.map(fp => fp.user_id))];
    }

    if (filteredUserIds.length === 0) {
      return { users: [], counts: { ...globalCounts, length: 0 } };
    }

    // STEP 6: Paginate (already sorted from userInfos)
    const paginatedUserIds = filteredUserIds.slice(offset, offset + limit);

    // STEP 7: Fetch final users with all relations
    const users = await HrisUserAccount.findAll({
      attributes: ["user_id", "user_email"],
      include: [
        {
          model: HrisUserInfo,
          attributes: ["first_name", "middle_name", "last_name", "extension_name", "user_pic"],
          required: true
        },
        {
          model: HrisUserServicePermission,
          attributes: ["service_id"],
          include: [{
            model: Service,
            attributes: ["service_name"],
            required: true
          }],
          required: true
        },
        {
          model: HrisUserAccessPermission,
          attributes: ["service_feature_id"],
          include: [{
            model: ServiceFeature,
            attributes: ["feature_name"],
            required: true
          }],
          required: false
        },
      ],
      where: { user_id: { [Op.in]: paginatedUserIds } },
      order: [
        [{ model: HrisUserInfo }, "last_name", "ASC"],
        [{ model: HrisUserInfo }, "first_name", "ASC"]
      ],
    });

    return {
      users,
      counts: {
        ...globalCounts,
        length: filteredUserIds.length
      }
    };
  } catch (error) {
    console.error("Error in findAllUsersWithPermissions:", error);
    throw error;
  }
};