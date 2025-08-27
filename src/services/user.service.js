const { Op } = require("sequelize");
const {
  HrisUserAccount,
  HrisUserInfo,
  HrisUserAddress,
  HrisUserEmergencyContact,
  HrisUserEmploymentInfo,
  HrisUserDesignation,
  HrisUserSalary,
  Company,
  CompanyAddress,
  CompanyDepartment,
  CompanyDivision,
  CompanyInfo,
  CompanyJobTitle,
  CompanyIndustry,
  HrisUserSalaryAdjustmentType,
  HrisUserJobLevel,
  HrisUserEmploymentStatus,
  HrisUserEmploymentType,
  HrisUserHr201,
  CompanyOffice,
  CompanyTeam,
  HrisUserGovernmentId,
  HrisUserGovernmentIdType,
  HrisUserShiftsTemplate,
} = require("../models");
const sequelize = require("../config/db");
const { generateUUIV4 } = require("../utils/ids");
const { buildUserFilters } = require("../utils/filter-builder");

exports.findAllHrisUserAccount = async () => {
  return await HrisUserAccount.findAll({
    include: [
      {
        model: HrisUserInfo,
      },
      {
        model: HrisUserAddress,
      },
      {
        model: HrisUserEmergencyContact,
      },
      {
        model: HrisUserHr201,
      },
      {
        model: HrisUserSalary,
        include: HrisUserSalaryAdjustmentType,
      },
      {
        model: HrisUserEmploymentInfo,
        include: [
          {
            model: HrisUserJobLevel,
          },
          {
            model: HrisUserEmploymentStatus,
          },
          {
            model: HrisUserEmploymentType,
          },
          {
            model: HrisUserShiftsTemplate,
          },
        ],
      },
      {
        model: HrisUserGovernmentId,
        include: HrisUserGovernmentIdType,
      },
      {
        model: HrisUserDesignation,
        include: [
          {
            model: Company,
            include: [
              {
                model: CompanyAddress,
              },

              {
                model: CompanyInfo,
                include: CompanyIndustry,
              },
            ],
          },
          {
            model: CompanyJobTitle,
          },
          {
            model: CompanyDepartment,
          },
          {
            model: CompanyDivision,
          },
          {
            model: HrisUserAccount,
            as: "upline",
            include: [{ model: HrisUserInfo }],
          },
          {
            model: CompanyOffice,
          },
          {
            model: CompanyTeam,
          },
        ],
      },
    ],
  });
};

exports.findHrisUserAccount = async (user_id) => {
  const hrisUserAccount = await HrisUserAccount.findOne({
    where: { user_id },
    include: [
      {
        model: HrisUserInfo,
      },
      {
        model: HrisUserAddress,
      },
      {
        model: HrisUserEmergencyContact,
      },
      {
        model: HrisUserHr201,
      },
      {
        model: HrisUserSalary,
        include: HrisUserSalaryAdjustmentType,
      },
      {
        model: HrisUserEmploymentInfo,
        include: [
          {
            model: HrisUserJobLevel,
          },
          {
            model: HrisUserEmploymentStatus,
          },
          {
            model: HrisUserEmploymentType,
          },
          {
            model: HrisUserShiftsTemplate,
          },
        ],
      },
      {
        model: HrisUserGovernmentId,
        include: HrisUserGovernmentIdType,
      },
      {
        model: HrisUserDesignation,
        include: [
          {
            model: Company,
            include: [
              {
                model: CompanyAddress,
              },

              {
                model: CompanyInfo,
                include: CompanyIndustry,
              },
            ],
          },
          {
            model: CompanyJobTitle,
          },
          {
            model: CompanyDepartment,
          },
          {
            model: CompanyDivision,
          },
          {
            model: HrisUserAccount,
            as: "upline",
            include: [{ model: HrisUserInfo }],
          },
          {
            model: CompanyOffice,
          },
          {
            model: CompanyTeam,
          },
        ],
      },
    ],
  });

  if (!hrisUserAccount)
    throw new Error(`No user found with the user_id: ${user_id}`);

  return hrisUserAccount;
};

// exports.findAllHrisUserAccountViaFilter = async (filters) => {
//   const {
//     whereAccount,
//     whereEmploymentInfo,
//     whereSalary,
//     whereDesignation,
//     whereInfo,
//   } = buildUserFilters(filters);

//   return await HrisUserAccount.findAll({
//     where: whereAccount,
//     include: [
//       {
//         model: HrisUserInfo,
//         where: Object.keys(whereInfo).length ? whereInfo : undefined,
//         required: Object.keys(whereInfo).length ? true : false,
//       },
//       {
//         model: HrisUserEmploymentInfo,
//         include: [{ model: HrisUserEmploymentStatus }],
//         where: Object.keys(whereEmploymentInfo).length
//           ? whereEmploymentInfo
//           : undefined,
//         required: Object.keys(whereEmploymentInfo).length ? true : false,
//       },
//       {
//         model: HrisUserSalary,
//         where: Object.keys(whereSalary).length ? whereSalary : undefined,
//         required: Object.keys(whereSalary).length ? true : false,
//       },
//       {
//         model: HrisUserDesignation,
//         where: Object.keys(whereDesignation).length
//           ? whereDesignation
//           : undefined,
//         required: Object.keys(whereDesignation).length ? true : false,
//       },
//     ],
//   });
// };

// exports.findAllHrisUserAccountViaSearchQuery = async (query) => {
//   return await HrisUserAccount.findAll({
//     where: {
//       [Op.or]: [
//         {
//           user_email: {
//             [Op.like]: `%${query}%`,
//           },
//         },
//         {
//           "$HrisUserInfo.first_name$": {
//             [Op.like]: `%${query}%`,
//           },
//         },
//         {
//           "$HrisUserInfo.last_name$": {
//             [Op.like]: `%${query}%`,
//           },
//         },
//       ],
//     },
//     include: [
//       {
//         model: HrisUserInfo,
//         required: true, // IMPORTANT for the $field$ syntax to work
//       },
//       {
//         model: HrisUserAddress,
//       },
//       {
//         model: HrisUserEmergencyContact,
//       },
//       {
//         model: HrisUserHr201,
//       },
//       {
//         model: HrisUserSalary,
//         include: HrisUserSalaryAdjustmentType,
//       },
//       {
//         model: HrisUserEmploymentInfo,
//         include: [
//           { model: HrisUserJobLevel },
//           { model: HrisUserEmploymentStatus },
//           { model: HrisUserEmploymentType },
//           {
//             model: HrisUserShiftsTemplate,
//           },
//         ],
//       },
//       {
//         model: HrisUserGovernmentId,
//         include: HrisUserGovernmentIdType,
//       },
//       {
//         model: HrisUserDesignation,
//         include: [
//           {
//             model: Company,
//             include: [
//               { model: CompanyAddress },
//               {
//                 model: CompanyInfo,
//                 include: CompanyIndustry,
//               },
//             ],
//           },
//           { model: CompanyJobTitle },
//           { model: CompanyDepartment },
//           { model: CompanyDivision },
//           { model: HrisUserAccount }, // for upline
//           { model: CompanyOffice },
//           { model: CompanyTeam },
//         ],
//       },
//     ],
//   });
// };

exports.findAllHrisUserAccountViaFilter = async (filters) => {
  const {
    whereAccount,
    whereEmploymentInfo,
    whereSalary,
    whereDesignation,
    whereInfo,
  } = buildUserFilters(filters);

  return await HrisUserAccount.findAll({
    where: whereAccount,
    include: [
      {
        model: HrisUserInfo,
        where: Object.keys(whereInfo).length ? whereInfo : undefined,
        required: Object.keys(whereInfo).length ? true : false,
      },
      {
        model: HrisUserAddress,
      },
      {
        model: HrisUserEmergencyContact,
      },
      {
        model: HrisUserHr201,
      },
      {
        model: HrisUserSalary,
        include: HrisUserSalaryAdjustmentType,
        where: Object.keys(whereSalary).length ? whereSalary : undefined,
        required: Object.keys(whereSalary).length ? true : false,
      },
      {
        model: HrisUserEmploymentInfo,
        include: [
          { model: HrisUserJobLevel },
          { model: HrisUserEmploymentStatus },
          { model: HrisUserEmploymentType },
          { model: HrisUserShiftsTemplate },
        ],
        where: Object.keys(whereEmploymentInfo).length
          ? whereEmploymentInfo
          : undefined,
        required: Object.keys(whereEmploymentInfo).length ? true : false,
      },
      {
        model: HrisUserGovernmentId,
        include: HrisUserGovernmentIdType,
      },
      {
        model: HrisUserDesignation,
        include: [
          {
            model: Company,
            include: [
              { model: CompanyAddress },
              {
                model: CompanyInfo,
                include: CompanyIndustry,
              },
            ],
          },
          { model: CompanyJobTitle },
          { model: CompanyDepartment },
          { model: CompanyDivision },
          {
            model: HrisUserAccount,
            as: "upline",
            include: [{ model: HrisUserInfo }],
          },
          { model: CompanyOffice },
          { model: CompanyTeam },
        ],
        where: Object.keys(whereDesignation).length
          ? whereDesignation
          : undefined,
        required: Object.keys(whereDesignation).length ? true : false,
      },
    ],
  });
};

exports.findUserByEmail = async (user_email) => {
  return await HrisUserAccount.findOne({
    where: { user_email },
    include: {
      model: HrisUserDesignation,
      include: Company,
    },
  });
};

exports.createHrisUserAccount = async (
  hrisUserAccountData,
  hrisUserInfoData,
  hrisUserDesignationData,
  hrisUserSalaryData,
  hrisUserAddressCurrentData,
  hrisUserAddressPermanentData,
  hrisUserHr201Data,
  hrisUserEmploymentInfoData,
  hrisUserGovernmentIdData,
  hrisUserEmergencyContactData
) => {
  return await sequelize.transaction(async (t) => {
    const hrisUserAccount = await HrisUserAccount.create(hrisUserAccountData, {
      transaction: t,
    });

    const hrisUserInfo = await HrisUserInfo.create(hrisUserInfoData, {
      transaction: t,
    });

    const hrisUserDesignation = await HrisUserDesignation.create(
      hrisUserDesignationData,
      { transaction: t }
    );

    const hrisUserSalary = await HrisUserSalary.create(hrisUserSalaryData, {
      transaction: t,
    });

    //PERMANENT ADDRESS
    const hrisUserAddressPermanent = await HrisUserAddress.create(
      hrisUserAddressPermanentData,
      { transaction: t }
    );

    //CURRENT ADDRESS
    const hrisUserAddressCurrent = await HrisUserAddress.create(
      hrisUserAddressCurrentData,
      { transaction: t }
    );

    const hrisUserHr201 = await HrisUserHr201.create(hrisUserHr201Data, {
      transaction: t,
    });

    const hrisUserEmploymentInfo = await HrisUserEmploymentInfo.create(
      hrisUserEmploymentInfoData,
      { transaction: t }
    );

    //governement ID/contribution
    const hrisUserGovernmentId = await HrisUserGovernmentId.bulkCreate(
      hrisUserGovernmentIdData,
      { transaction: t }
    );

    //emergency contacts
    const hrisUserEmergencyContact = await HrisUserEmergencyContact.bulkCreate(
      hrisUserEmergencyContactData,
      { transaction: t }
    );

    return {
      hrisUserAccount,
      hrisUserInfo,
      hrisUserDesignation,
      hrisUserSalary,
      hrisUserAddressPermanent,
      hrisUserAddressCurrent,
      hrisUserHr201,
      hrisUserEmploymentInfo,
      hrisUserGovernmentId,
      hrisUserEmergencyContact,
    };
  });
};

exports.isUserIdTaken = async (user_id) => {
  const existingUser = await HrisUserAccount.findOne({
    where: { user_id },
    attributes: ["user_id"],
  });
  return !!existingUser;
};

exports.updatePersonalDetails = async (user_id, updatedFields) => {
  return await sequelize.transaction(async (t) => {
    const [rowsUpdated] = await HrisUserInfo.update(updatedFields, {
      where: { user_id },
      transaction: t,
    });

    if (rowsUpdated === 0) return null;

    const updatedUserInfo = await HrisUserInfo.findOne({
      where: { user_id },
      transaction: t,
    });

    return updatedUserInfo;
  });
};

exports.updateContactInfo = async (user_id, accountFields, infoFields) => {
  return await sequelize.transaction(async (t) => {
    if (Object.keys(accountFields).length > 0) {
      await HrisUserAccount.update(accountFields, {
        where: { user_id },
        transaction: t,
      });
    }

    if (Object.keys(infoFields).length > 0) {
      await HrisUserInfo.update(infoFields, {
        where: { user_id },
        transaction: t,
      });
    }

    const updatedUser = await HrisUserAccount.findOne({
      where: { user_id },
      include: [HrisUserInfo],
      transaction: t,
    });

    return updatedUser;
  });
};
exports.updateGovernmentRemittances = async (user_id, governmentIds) => {
  const debugLogs = [];

  const results = await sequelize.transaction(async (t) => {
    const idTypes = await HrisUserGovernmentIdType.findAll({ transaction: t });
    const typeLookup = {};
    idTypes.forEach((type) => {
      typeLookup[type.government_id_name.toLowerCase()] =
        type.government_id_type_id;
    });

    for (const [field, value] of Object.entries(governmentIds)) {
      const typeId = typeLookup[field.toLowerCase()];
      if (!typeId) {
        const msg = `Unknown government ID type: ${field}`;
        debugLogs.push(msg);
        continue;
      }

      const existing = await HrisUserGovernmentId.findOne({
        where: { user_id, government_id_type_id: typeId },
        transaction: t,
      });

      if (value === null || value === "") {
        if (existing) {
          await existing.destroy({ transaction: t });
          debugLogs.push(`Deleted ${field}`);
        } else {
          debugLogs.push(`No record to delete for ${field}`);
        }
        continue;
      }

      if (existing) {
        await existing.update(
          {
            government_id_number: value,
            updated_at: new Date(),
          },
          { transaction: t }
        );
        debugLogs.push(`Updated ${field} → ${value}`);
      } else {
        await HrisUserGovernmentId.create(
          {
            user_government_id: generateUUIV4(),
            government_id_type_id: typeId,
            government_id_number: value,
            user_id,
            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction: t }
        );
        debugLogs.push(`Inserted ${field} → ${value}`);
      }
    }

    const updatedRecords = await HrisUserGovernmentId.findAll({
      where: { user_id },
      include: [HrisUserGovernmentIdType],
      transaction: t,
    });

    return { updatedRecords, debugLogs };
  });

  return results;
};

exports.updateEmergencyContacts = async (user_id, emergency_contacts) => {
  const debugLogs = [];

  if (!Array.isArray(emergency_contacts)) {
    throw new Error("emergency_contacts must be an array");
  }

  const results = await sequelize.transaction(async (t) => {
    const existingContacts = await HrisUserEmergencyContact.findAll({
      where: { user_id },
      transaction: t,
    });

    const existingContactMap = {};
    existingContacts.forEach((contact) => {
      existingContactMap[contact.user_emergency_contact_id] = contact;
    });

    const processedContactIds = new Set();

    for (const contact of emergency_contacts) {
      const full_name = contact.name?.trim() || null;
      const contact_number = contact.contactNumber?.trim() || null;
      const relationship = contact.relationship?.trim() || null;

      const isAllEmpty = !full_name && !contact_number && !relationship;

      if (isAllEmpty) {
        const existing = existingContacts.find(
          (c) =>
            (!c.full_name || c.full_name === "") &&
            (!c.contact_number || c.contact_number === "") &&
            (!c.relationship || c.relationship === "")
        );
        if (existing) {
          await existing.destroy({ transaction: t });
          debugLogs.push(
            `Deleted contact: ${existing.full_name || "null"} (${
              existing.contact_number || "null"
            })`
          );
          processedContactIds.add(existing.user_emergency_contact_id);
        } else {
          debugLogs.push(
            `No contact to delete: ${full_name || "null"} (${
              contact_number || "null"
            })`
          );
        }
        continue;
      }

      if ((!full_name || !contact_number) && !isAllEmpty) {
        debugLogs.push(
          `Keeping incomplete contact (not all empty): ${
            full_name || "null"
          } (${contact_number || "null"})`
        );

        const existing = existingContacts.find(
          (c) =>
            (c.full_name === full_name || !full_name) &&
            (c.contact_number === contact_number || !contact_number)
        );
        if (existing) {
          processedContactIds.add(existing.user_emergency_contact_id);
        }
        continue;
      }

      const existing = existingContacts.find(
        (c) => c.full_name === full_name && c.contact_number === contact_number
      );

      if (existing) {
        await existing.update(
          {
            full_name,
            contact_number,
            relationship,
          },
          { transaction: t }
        );
        debugLogs.push(`Updated contact: ${full_name} (${contact_number})`);
        processedContactIds.add(existing.user_emergency_contact_id);
      } else {
        const newContact = await HrisUserEmergencyContact.create(
          {
            user_emergency_contact_id: generateUUIV4(),
            user_id,
            full_name,
            contact_number,
            relationship,
          },
          { transaction: t }
        );
        debugLogs.push(`Inserted contact: ${full_name} (${contact_number})`);
        processedContactIds.add(newContact.user_emergency_contact_id);
      }
    }

    for (const existingContact of existingContacts) {
      if (!processedContactIds.has(existingContact.user_emergency_contact_id)) {
        if (
          existingContact.full_name ||
          existingContact.contact_number ||
          existingContact.relationship
        ) {
          await existingContact.destroy({ transaction: t });
          debugLogs.push(
            `Deleted unlisted contact: ${
              existingContact.full_name || "null"
            } (${existingContact.contact_number || "null"})`
          );
        }
      }
    }

    const updatedRecords = await HrisUserEmergencyContact.findAll({
      where: { user_id },
      transaction: t,
    });

    return { updatedRecords, debugLogs };
  });

  return results;
};

exports.updateAddresses = async (user_id, addresses) => {
  const debugLogs = [];

  if (!Array.isArray(addresses)) {
    throw new Error("addresses must be an array");
  }

  const results = await sequelize.transaction(async (t) => {
    const existingAddresses = await HrisUserAddress.findAll({
      where: { user_id },
      transaction: t,
    });

    const existingMap = new Map(
      existingAddresses.map((addr) => [addr.user_address_id, addr])
    );

    const processedIds = new Set();

    for (const addr of addresses) {
      const {
        user_address_id,
        building_num,
        street,
        barangay,
        barangayCode,
        city,
        cityCode,
        postal_code,
        province,
        provinceCode,
        region,
        regionCode,
        country,
        address_type,
      } = addr;

      if (user_address_id && existingMap.has(user_address_id)) {
        const existing = existingMap.get(user_address_id);
        await existing.update(
          {
            building_num,
            street,
            barangay,
            barangayCode,
            city,
            cityCode,
            postal_code,
            province,
            provinceCode,
            region,
            regionCode,
            country,
            address_type,
          },
          { transaction: t }
        );
        debugLogs.push(`Updated ${address_type} address (${user_address_id})`);
        processedIds.add(user_address_id);
      } else {
        const newId = generateUUIV4();
        await HrisUserAddress.create(
          {
            user_address_id: newId,
            user_id,
            building_num,
            street,
            barangay,
            barangayCode,
            city,
            cityCode,
            postal_code,
            province,
            provinceCode,
            region,
            regionCode,
            country,
            address_type,
          },
          { transaction: t }
        );
        debugLogs.push(`Inserted ${address_type} address (${newId})`);
        processedIds.add(newId);
      }
    }
    for (const existing of existingAddresses) {
      if (!processedIds.has(existing.user_address_id)) {
        await existing.destroy({ transaction: t });
        debugLogs.push(
          `Deleted ${existing.address_type} address (${existing.user_address_id})`
        );
      }
    }

    const updatedRecords = await HrisUserAddress.findAll({
      where: { user_id },
      transaction: t,
    });

    return { updatedRecords, debugLogs };
  });

  return results;
};

exports.updateHr201url = async (user_id, hr201_url) => {
  return await HrisUserHr201.sequelize.transaction(async (t) => {
    const [rowsUpdated] = await HrisUserHr201.update(
      { hr201_url, updated_at: new Date() },
      {
        where: { user_id },
        transaction: t,
      }
    );

    let hr201Record;

    if (rowsUpdated === 0) {
      hr201Record = await HrisUserHr201.create(
        {
          hr201_id: generateUUIV4(),
          user_id,
          hr201_url,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction: t }
      );
    } else {
      hr201Record = await HrisUserHr201.findOne({
        where: { user_id },
        transaction: t,
      });
    }

    return hr201Record;
  });
};

exports.updateDesignation = async (
  user_id,
  { designationFields, employmentFields }
) => {
  console.log("Service: Starting updateDesignation", {
    user_id,
    designationFields,
    employmentFields,
  });

  return await sequelize.transaction(async (t) => {
    let updatedDesignation = null;
    let updatedEmployment = null;

    if (Object.keys(designationFields).length > 0) {
      console.log("Service: Updating designation for user_id", user_id);
      const existingDesignation = await HrisUserDesignation.findOne({
        where: { user_id },
        transaction: t,
      });

      if (!existingDesignation) {
        console.log(
          "Service: No existing designation found for user_id",
          user_id
        );
        return null;
      }

      const mergedDesignation = {
        ...existingDesignation.get(),
        ...designationFields,
      };

      console.log(
        "Service: Updating HrisUserDesignation with",
        mergedDesignation
      );
      await HrisUserDesignation.update(mergedDesignation, {
        where: { user_id },
        transaction: t,
      });

      console.log("Service: Fetching updated designation with includes");
      updatedDesignation = await HrisUserDesignation.findOne({
        where: { user_id },
        include: [
          {
            model: Company,
            include: [
              { model: CompanyAddress },
              {
                model: CompanyInfo,
                include: { model: CompanyIndustry },
              },
            ],
          },
          { model: CompanyJobTitle },
          { model: CompanyDepartment },
          { model: CompanyDivision },
          {
            model: HrisUserAccount,
            as: "upline",
            include: [{ model: HrisUserInfo }],
          },
          { model: CompanyOffice },
          { model: CompanyTeam },
        ],
        transaction: t,
      });
    }

    if (Object.keys(employmentFields).length > 0) {
      console.log("Service: Updating employment info for user_id", user_id);
      const existingEmployment = await HrisUserEmploymentInfo.findOne({
        where: { user_id },
        transaction: t,
      });

      if (!existingEmployment) {
        console.log(
          "Service: No existing employment info found for user_id",
          user_id
        );
        return null;
      }

      const mergedEmployment = {
        ...existingEmployment.get(),
        ...employmentFields,
      };

      console.log(
        "Service: Updating HrisUserEmploymentInfo with",
        mergedEmployment
      );
      await HrisUserEmploymentInfo.update(mergedEmployment, {
        where: { user_id },
        transaction: t,
      });

      console.log("Service: Fetching updated employment info with includes");
      updatedEmployment = await HrisUserEmploymentInfo.findOne({
        where: { user_id },
        include: [
          { model: HrisUserJobLevel },
          { model: HrisUserEmploymentStatus },
          { model: HrisUserEmploymentType },
          { model: HrisUserShiftsTemplate },
        ],
        transaction: t,
      });
    }

    console.log("Service: Returning updated data", {
      designation: updatedDesignation,
      employment: updatedEmployment,
    });
    return { designation: updatedDesignation, employment: updatedEmployment };
  });
};

exports.updateEmploymentTimeline = async (user_id, updatedFields) => {
  console.log("Updating user_id:", user_id);
  const record = await HrisUserEmploymentInfo.findOne({ where: { user_id } });
  console.log("Found record before update:", record);

  return await sequelize.transaction(async (t) => {
    const [rowsUpdated] = await HrisUserEmploymentInfo.update(updatedFields, {
      where: { user_id },
      transaction: t,
    });

    if (rowsUpdated === 0) return null;

    const updatedEmploymentTimeline = await HrisUserEmploymentInfo.findOne({
      where: { user_id },
      transaction: t,
    });

    return updatedEmploymentTimeline;
  });
};
