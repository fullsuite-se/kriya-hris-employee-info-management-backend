const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CompanyOffice = sequelize.define(
    'CompanyOffice',
    {
        office_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        company_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'companies',
                key: 'company_id',
            }
        },
        office_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        office_address: {
            type: DataTypes.STRING,
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
        tableName: 'company_offices',
        timestamps: false,
    }
);

module.exports = CompanyOffice; 