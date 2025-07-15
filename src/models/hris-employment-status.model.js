const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const HrisEmploymentStatus = sequelize.define(
    'HrisEmploymentStatus',
    {
        employment_status_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        employment_status: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        }
    },
    {
        tableName: 'hris_employment_statuses',
        timestamps: false,
    },
);

module.exports = HrisEmploymentStatus;