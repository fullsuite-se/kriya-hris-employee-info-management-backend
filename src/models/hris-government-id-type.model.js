const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisGovernmentIdType = sequelize.define(
    'HrisGovernmentIdType',
    {
        government_id_type_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        government_id_name: {
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
        tableName: 'hris_government_id_types',
        timestamps: false,
    }
);
module.exports = HrisGovernmentIdType;