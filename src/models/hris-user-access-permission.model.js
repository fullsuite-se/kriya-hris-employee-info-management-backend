const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserAccessPermission = sequelize.define(
    'HrisUserAccessPermission',
    {
        user_access_permission_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id',
            }
        },
        service_feature_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'service_features',
                key: 'service_feature_id',
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        }
    },
    {
        tableName: 'hris_user_access_permissions',
        timestamps: false
    }
);

module.exports = HrisUserAccessPermission;