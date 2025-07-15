const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserJobLevel = sequelize.define(
    'HrisUserJobLevel',
    {
        job_level_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        job_level_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        job_level_description: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: 'hris_user_job_levels',
        timestamps: false,
    }

);

module.exports = HrisUserJobLevel;