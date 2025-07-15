const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserEmploymentType = sequelize.define(
    'HrisUserEmploymentType',
    {
        employment_type_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        employment_type: {
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
        tableName: 'hris_user_employment_types',
        timestamps: false,
    }

);

module.exports = HrisUserEmploymentType;