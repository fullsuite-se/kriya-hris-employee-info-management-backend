const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SuperAdminAccount = sequelize.define(
    'SuperAdminAccount',
    {
        super_admin_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id',
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'super_admin_accounts',
        timestamps: false
    }
);

module.exports = SuperAdminAccount;