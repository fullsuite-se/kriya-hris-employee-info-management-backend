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
