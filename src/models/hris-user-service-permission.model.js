const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserServicePermission = sequelize.define(
    'HrisUserServicePermission',
    {
        user_service_permission_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false
        },
        service_id: {
            type: DataTypes.CHAR(36),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'hris_user_service_permissions',
        timestamps: false
    }
);

module.exports = HrisUserServicePermission; 