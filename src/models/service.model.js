const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Service = sequelize.define(
    'Service',
    {
        service_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        service_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        }
    },
    {
        tableName: 'services',
        timestamps: false
    }
);

module.exports = Service; 