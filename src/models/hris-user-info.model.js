const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserInfo = sequelize.define(
  'HrisUserInfo',
  {
    user_info_id: {
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
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    extension_name: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    sex: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    user_pic: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    personal_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contact_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    blood_type: {
      type: DataTypes.ENUM(
        'A',
        'A+',
        'A-',
        'B',
        'B+',
        'B-',
        'AB',
        'AB+',
        'AB-',
        'O',
        'O+',
        'O-',
        'Unknown'
      ),
      allowNull: true,
    },
    civil_status: {
      type: DataTypes.ENUM(
        'Single',
        'Married',
        'Divorced',
        'Widowed',
        'Separated',
        'Civil Union'
      ),
      allowNull: true,
    },
    //added
    birth_place: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    height_cm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    weight_kg: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    company_issued_phone_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },

    gender: {
      type: DataTypes.ENUM(
        'Cisgender',
        'Transgender',
        'Non-binary',
        'Genderqueer',
        'Agender',
        'Genderfluid',
        'Intersex',
        'Bigender',
        'Pangender',
        'Gender non-conforming'
      ),
      allowNull: true,
    },
  },
  {
    tableName: 'hris_user_infos',
    timestamps: false,
  }
);

module.exports = HrisUserInfo;
