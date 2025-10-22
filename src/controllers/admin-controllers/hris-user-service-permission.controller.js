const { getUserServicePermission, addUserServicePermission, deleteUserServicePermission, getAllFeaturesByServiceId, getAllServicesAndFeatures } = require("../../services/access-control/hris-user-service-permission.service");
const { findAllUsersWithPermissions } = require('../../services/access-control/user-with-permissions.service');
exports.getAll = async (req, res) => {
  const { user_id } = req.params;

  try {
    const servicePermissions = await getUserServicePermission(user_id);
    return res.status(200).json({ message: "Fetched successfully", servicePermissions })
  } catch (error) {
    return res.status(500).json({ message: "Failed", error: error.message });
  }
}

exports.getAllServicesAndFeatures = async (req, res) => {
  try {
    const { service: serviceId } = req.query;

    const servicesAndFeatures = await getAllServicesAndFeatures(serviceId);

    return res.status(200).json({
      message: "Fetched services and their features successfully",
      servicesAndFeatures,
    });
  } catch (error) {
    console.error("Error fetching services and features:", error);
    return res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.getAllFeatures = async (req, res) => {
  const { service_id } = req.params;

  try {
    const serviceFeatures = await getAllFeaturesByServiceId(service_id);
    return res.status(200).json({ message: "Fetched service features successfully", serviceFeatures })
  } catch (error) {
    return res.status(500).json({ message: "Failed", error: error.message });

  }
}

exports.create = async (req, res) => {
  const { user_id } = req.params;
  let { service_ids } = req.body;

  if (!Array.isArray(service_ids)) {
    service_ids = [service_ids];
  }

  try {
    const servicePermissions = await addUserServicePermission(user_id, service_ids);
    return res.status(200).json({ message: "created successfully", servicePermissions })
  } catch (error) {
    return res.status(500).json({ message: "Failed", error: error.message });
  }

}


exports.delete = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  try {
    await deleteUserServicePermission(user_id);
    return res.status(200).json({ message: "All service permissions deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed", error: error.message });
  }
};




//get users with access
exports.getUsersWithPermissions = async (req, res) => {
  try {
    let { service_ids, service_feature_ids, page, limit, searchFilter } = req.query;

    const serviceIds = service_ids ? JSON.parse(service_ids) : null;
    const serviceFeatureIds = service_feature_ids ? JSON.parse(service_feature_ids) : null;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const { users, counts } = await findAllUsersWithPermissions(
      serviceIds,
      serviceFeatureIds,
      { offset, limit },
      searchFilter 
    );

    return res.status(200).json({
      message: "Users with permissions retrieved successfully",
      users,
      pagination: { page, limit, total: counts.length },
      ...counts, 
    });
  } catch (error) {
    console.error("getUsersWithPermissions error:", error);
    return res.status(500).json({
      message: "Failed to fetch users with permissions",
      error: error.message,
    });
  }
};