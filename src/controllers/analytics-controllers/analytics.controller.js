const analyticsService = require("../../services/analytics/analytics.service");

exports.getMonthlyTrends = async (req, res) => {
    try {
        const { year } = req.query;

        const trends = await analyticsService.getMonthlyTrends(
            year ? parseInt(year) : null
        );

        return res.json({
            success: true,
            data: trends
        });
    } catch (error) {
        console.error("Error in getMonthlyTrends:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAvailableYears = async (req, res) => {
    try {
        const years = await analyticsService.getAvailableYears();

        return res.json({
            success: true,
            data: years
        });
    } catch (error) {
        console.error("Error in getAvailableYears:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAttritionRate = async (req, res) => {
    try {
        const { year } = req.query;

        const rates = await analyticsService.getAttritionRate(
            year ? parseInt(year) : null
        );

        return res.json({
            success: true,
            data: rates
        });
    } catch (error) {
        console.error("Error in getAttritionRate:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getSexDistribution = async (req, res) => {
    try {
        const data = await analyticsService.getSexDistribution();

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error fetching gender distribution:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch gender distribution"
        });
    }
};

exports.getAgeDistribution = async (req, res) => {
    try {
        const data = await analyticsService.getAgeDistribution();

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error fetching age distribution:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch age distribution"
        });
    }
};
