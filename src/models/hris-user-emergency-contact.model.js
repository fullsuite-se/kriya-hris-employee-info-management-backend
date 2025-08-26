const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserEmergencyContact = sequelize.define(
  'HrisUserEmergencyContact',
  {
    user_emergency_contact_id: {
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
      },
    },
    full_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: 'hris_user_emergency_contacts',
    timestamps: false,
  }
);

module.exports = HrisUserEmergencyContact;
