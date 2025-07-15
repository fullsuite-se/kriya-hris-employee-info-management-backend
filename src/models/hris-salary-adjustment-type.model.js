const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisSalaryAdjustmentType = sequelize.define(
    'salary_adjustment_type_id',
    {
        salary_adjustment_type_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        salary_adjustment_type: {
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
        },
    },
    {
        tableName: 'hris_salary_adjustment_types',
        timestamps: false,
    }
);

module.exports = HrisSalaryAdjustmentType;