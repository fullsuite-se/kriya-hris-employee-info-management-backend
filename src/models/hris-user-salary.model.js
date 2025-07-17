// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// const HrisUserSalary = sequelize.define(
//     'HrisUserSalary',
//     {
//         user_salary_id: {
//             type: DataTypes.CHAR(36),
//             primaryKey: true,
//             allowNull: false
//         },
//         user_id: {
//             type: DataTypes.CHAR(36),
//             allowNull: false,
//             references: {
//                 model: 'hris_user_accounts',
//                 key: 'user_id',
//             }
//         },
//         base_pay: {
//             type: DataTypes.DECIMAL(10, 2),
//             allowNull: false, 
//             defaultValue: 0,
//         },
//         salary_adjustment_type_id: {
//             type: DataTypes.CHAR(36),
//             allowNull: false,
//             references: {
//                 model: 'hris_user_salary_adjustment_types',
//                 key: 'salary_adjustment_type_id',
//             }
//         },
//         date: {
//             type: DataTypes.DATEONLY,
//             allowNull: false,
//             defaultValue: DataTypes.NOW()
//         },
//         created_at: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: DataTypes.NOW()
//         },
//         updated_at: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: DataTypes.NOW()
//         },
//     },
//     {
//         tableName: 'hris_user_salaries',
//         timestamps: false
//     }
// );

// module.exports = HrisUserSalary; 

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserSalary = sequelize.define(
    'HrisUserSalary',
    {
        user_salary_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id',
            }
        },
        base_pay: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        salary_adjustment_type_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_salary_adjustment_types',
                key: 'salary_adjustment_type_id',
            }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW()
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW()
        },
    },
    {
        tableName: 'hris_user_salaries',
        timestamps: false
    }
);

module.exports = HrisUserSalary; 