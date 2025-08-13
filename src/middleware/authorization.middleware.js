const { getUserAccessPermissions } = require("../services/access-control/hris-user-access-permission.service");

exports.checkAuthorizationToAccessFeature = (requiredFeatures) => {
    return async (req, res, next) => {
        try {
            const currentUser = req.user;
            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized. No user context." });
            }

            // Normalize the required features into lowercase array
            const requiredFeatureList = Array.isArray(requiredFeatures)
                ? requiredFeatures.map(f => f.toLowerCase())
                : [requiredFeatures.toLowerCase()];

            // Helper: check if any required features are missing
            const findMissingFeatures = (availableFeatures) => {
                const normalizedAvailable = availableFeatures.map(f => f.feature_name?.toLowerCase());
                return requiredFeatureList.filter(reqFeature => !normalizedAvailable.includes(reqFeature));
            };

            // First Defence: Check against features derived from token
            const userFeatures = currentUser.accessPermissions || [];
            const missingFromUser = findMissingFeatures(userFeatures);

            if (missingFromUser.length > 0) {
                return res.status(403).json({
                    message: `Access denied. Missing required features: ${missingFromUser.join(", ")}`
                });
            }

            // Second Defence: Check against DB-level permission
            const dbFeatures = await getUserAccessPermissions(currentUser.system_user_id);
            const missingFromDb = findMissingFeatures(dbFeatures);

            if (missingFromDb.length > 0) {
                return res.status(403).json({
                    message: `Access denied. Missing required features: ${missingFromDb.join(", ")}`
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
