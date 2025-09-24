const { getUserAccessPermissions, addUserAccessPermissions, deleteUserAccessPermissions } = require("../../services/access-control/hris-user-access-permission.service");

exports.getAll = async (req, res) => {
    const { user_id } = req.params;

    try {
        const accessPermissions = await getUserAccessPermissions(user_id);
        return res.status(200).json({ message: "Fetched successfully", accessPermissions });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.create = async (req, res) => {
    const { user_id } = req.params;

    let { service_feature_ids } = req.body;

    if (!Array.isArray(service_feature_ids)) {
        service_feature_ids = [service_feature_ids];
    }

    try {
        const accessPermissions = await addUserAccessPermissions(user_id, service_feature_ids);
        return res.status(200).json({ message: "Created successfully", accessPermissions })
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
    await deleteUserAccessPermissions(user_id);
    return res.status(200).json({ message: "All access permissions deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed", error: error.message });
  }
};