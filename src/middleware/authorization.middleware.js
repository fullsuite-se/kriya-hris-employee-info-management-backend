exports.checkAuthorizationToAccessFeature = (requiredFeatures) => {
    return (req, res, next) => {
        const user = req.user;
        const userFeatures = user?.accessPermissions || [];

        // Normalize feature names to lowercase for case-insensitive comparison
        const userFeatureNames = userFeatures.map(f => f.feature_name?.toLowerCase());

        // Ensure requiredFeatures is always an array
        const required = Array.isArray(requiredFeatures) ? requiredFeatures : [requiredFeatures];
        const normalizedRequired = required.map(f => f.toLowerCase());

        // Check for missing features
        const missing = normalizedRequired.filter(f => !userFeatureNames.includes(f));

        if (missing.length > 0) {
            return res.status(403).json({
                message: `Access denied. Missing required features: ${missing.join(", ")}`
            });
        }

        //second line of defence is to check the user service feature access in the database. 
        //...

        next();
    };
};