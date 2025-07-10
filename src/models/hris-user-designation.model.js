const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserDesignation = sequelize.define(
    'HrisUserDesignation',
    {
        user_designation_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false
        },
        company_id: {
            type: DataTypes.CHAR(36),
            allowNull: false
        },
        user_shift_id: {
            type: DataTypes.CHAR(36),
            allowNull: true
        },
        job_title_id: {
            type: DataTypes.CHAR(36),
            allowNull: true
        },
        department_id: {
            type: DataTypes.CHAR(36),
            allowNull: true
        },
        division_id: {
            type: DataTypes.CHAR(36),
            allowNull: true
        },
        upline_id: {
            type: DataTypes.CHAR(36),
            allowNull: true
        }
    },
    {
        tableName: 'hris_user_designations',
        timestamps: false
    }
);

module.exports = HrisUserDesignation; 