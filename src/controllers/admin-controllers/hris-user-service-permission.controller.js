const { getUserServicePermission, addUserServicePermission, deleteUserServicePermission, getAllFeaturesByServiceId, getAllServicesAndFeatures } = require("../../services/access-control/hris-user-service-permission.service");

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

exports.getAllFeatures = async (req,res)=>{
    const {service_id}= req.params;

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
    let { user_service_permission_ids } = req.body;

    if (!Array.isArray(user_service_permission_ids)) {
        user_service_permission_ids = [user_service_permission_ids];
    }

    try {
        await deleteUserServicePermission(user_service_permission_ids);
        return res.status(200).json({ message: "deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}