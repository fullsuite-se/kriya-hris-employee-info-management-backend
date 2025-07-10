const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServiceFeature = sequelize.define(
    'ServiceFeature',
    {
        service_feature_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        service_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'services',
                key: 'service_id',
            }
        },
        feature_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'service_features',
        timestamps: false
    }
);

module.exports = ServiceFeature; 