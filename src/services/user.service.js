const { Op } = require("sequelize");
const { HrisUserAccount, HrisUserInfo, HrisUserAddress, HrisUserEmergencyContact, HrisUserEmploymentInfo, HrisUserDesignation, HrisUserSalary, Company, CompanyAddress, CompanyDepartment, CompanyDivision, CompanyInfo, CompanyJobTitle, CompanyIndustry, HrisUserSalaryAdjustmentType, HrisUserJobLevel, HrisUserEmploymentStatus, HrisUserEmploymentType, HrisUserHr201, CompanyOffice, CompanyTeam, HrisUserGovernmentId, HrisUserGovernmentIdType, HrisUserShiftsTemplate, HrisUserAccessPermission, HrisUserServicePermission, Service, ServiceFeature, CompanyEmployer, } = require("../models");
const sequelize = require("../config/db");
const { generateUUIV4 } = require("../utils/ids");
const { buildUserFilters } = require("../utils/filter-builder");



exports.findAllHrisUserAccounts = async ({
  search,
  filters = {},
  page = 1,
  limit = 10,
} = {}) => {
  const offset = (page - 1) * limit;

  const {
    whereAccount,
    whereEmploymentInfo,
    whereDesignation,
    whereInfo,
  } = buildUserFilters(filters);

  const queryOptions = {
    attributes: ["user_id", "user_email"],
    include: [
      {
        model: HrisUserInfo,
        attributes: [
          "first_name",
          "middle_name",
          "last_name",
          "extension_name",
          "user_pic",
        ],
        where: Object.keys(whereInfo).length ? whereInfo : {},
        required: !!Object.keys(whereInfo).length,
      },
      {
        model: HrisUserEmploymentInfo,
        attributes: ["date_hired", "date_regularization"],
        include: [
          {
            model: HrisUserEmploymentStatus,
            attributes: ["employment_status"],
          },
        ],
        where: Object.keys(whereEmploymentInfo).length
          ? whereEmploymentInfo
          : {},
        required: !!Object.keys(whereEmploymentInfo).length,
      },
      {
        model: HrisUserDesignation,
        attributes: ["upline_id"],
        include: [
          { model: CompanyJobTitle, attributes: ["job_title"] },
          { model: CompanyDepartment, attributes: ["department_name"] },
        ],
        where: Object.keys(whereDesignation).length ? whereDesignation : {},
        required: !!Object.keys(whereDesignation).length,
      },
    ],
    where: Object.keys(whereAccount).length ? whereAccount : {},
    limit,
    offset,
    distinct: true,
    subQuery: false,
    order: [
      [HrisUserInfo, "last_name", "ASC"],
      [HrisUserInfo, "first_name", "ASC"],
      [HrisUserInfo, "middle_name", "ASC"],
    ],
  };

  if (search && search.trim() !== "") {
    const searchTerm = `%${search}%`;
    const searchWords = search.trim().split(/\s+/).filter((word) => word.length > 0);
    const searchWordCount = searchWords.length;

    const accountSearchConditions = {
      [Op.or]: [
        { user_id: { [Op.like]: searchTerm } },
        { user_email: { [Op.like]: searchTerm } },
      ],
    };

    const replacements = { searchTerm };

    let nameSearchConditions = `
      hris_user_infos.first_name LIKE :searchTerm OR
      hris_user_infos.middle_name LIKE :searchTerm OR
      hris_user_infos.last_name LIKE :searchTerm OR
      hris_user_infos.extension_name LIKE :searchTerm OR
      CONCAT(hris_user_infos.first_name, ' ', hris_user_infos.last_name) LIKE :searchTerm OR
      CONCAT(hris_user_infos.last_name, ', ', hris_user_infos.first_name) LIKE :searchTerm OR
      CONCAT(hris_user_infos.first_name, ' ', COALESCE(hris_user_infos.middle_name, ''), ' ', hris_user_infos.last_name) LIKE :searchTerm OR
      CONCAT(hris_user_infos.last_name, ', ', hris_user_infos.first_name, ' ', COALESCE(hris_user_infos.middle_name, '')) LIKE :searchTerm OR
      CONCAT(hris_user_infos.last_name, ' ', hris_user_infos.first_name) LIKE :searchTerm
    `;

    if (searchWordCount > 1) {
      nameSearchConditions += `
        OR (
          hris_user_infos.first_name LIKE :searchTerm
        )
        OR (
          hris_user_infos.first_name LIKE :firstWords AND
          hris_user_infos.last_name LIKE :lastWord
        )
        OR (
          hris_user_infos.last_name LIKE :firstWords AND
          hris_user_infos.first_name LIKE :lastWord
        )
      `;

      const firstWords = searchWords.slice(0, -1).join(" ");
      const lastWord = searchWords[searchWordCount - 1];

      replacements.firstWords = `%${firstWords}%`;
      replacements.lastWord = `%${lastWord}%`;

      if (searchWordCount > 2) {
        nameSearchConditions += `
          OR (
            hris_user_infos.first_name LIKE :firstWord AND
            hris_user_infos.middle_name LIKE :middleWords AND
            hris_user_infos.last_name LIKE :lastWord
          )
          OR (
            hris_user_infos.first_name LIKE :multiWordFirst AND
            hris_user_infos.last_name LIKE :lastWord
          )
        `;

        const firstWord = searchWords[0];
        const middleWords = searchWords.slice(1, -1).join(" ");
        const multiWordFirst = searchWords.slice(0, -1).join(" ");

        replacements.firstWord = `%${firstWord}%`;
        replacements.middleWords = `%${middleWords}%`;
        replacements.multiWordFirst = `%${multiWordFirst}%`;
      }

      nameSearchConditions += `
        OR (
          (hris_user_infos.first_name LIKE :word1 AND hris_user_infos.last_name LIKE :word2)
          OR (hris_user_infos.last_name LIKE :word1 AND hris_user_infos.first_name LIKE :word2)
      `;

      searchWords.forEach((word, index) => {
        replacements[`word${index + 1}`] = `%${word}%`;
      });

      if (searchWordCount > 2) {
        nameSearchConditions += `
          OR (hris_user_infos.first_name LIKE :word1 AND hris_user_infos.middle_name LIKE :word2 AND hris_user_infos.last_name LIKE :word3)
          OR (hris_user_infos.first_name LIKE :word1 AND hris_user_infos.last_name LIKE :word2 AND hris_user_infos.middle_name LIKE :word3)
        `;
      }

      nameSearchConditions += `)`;
    }

    queryOptions.where = {
      ...queryOptions.where,
      [Op.or]: [
        accountSearchConditions,
        sequelize.literal(`EXISTS (
          SELECT 1 FROM hris_user_infos 
          WHERE hris_user_infos.user_id = HrisUserAccount.user_id 
          AND (${nameSearchConditions})
        )`),
      ],
    };

    queryOptions.replacements = replacements;

    const infoIncludeIndex = queryOptions.include.findIndex(
      (include) => include.model === HrisUserInfo
    );
    if (infoIncludeIndex !== -1) {
      queryOptions.include[infoIncludeIndex].required = true;
    }
  }

  const result = await HrisUserAccount.findAndCountAll(queryOptions);

  const userIds = result.rows.map((user) => user.user_id);

  const permissions = await HrisUserServicePermission.findAll({
    attributes: ["user_id"],
    where: { user_id: userIds },
    group: ["user_id"],
    raw: true,
  });

  const usersWithAccess = new Set(permissions.map((p) => p.user_id));

  const rowsWithAccessFlag = result.rows.map((user) => ({
    ...user.get({ plain: true }),
    haveAccess: usersWithAccess.has(user.user_id),
  }));

  return {
    count: result.count,
    rows: rowsWithAccessFlag,
  };
};

//get all employees for dropdown
exports.findAllEmployeesForDropdown = async () => {
  try {
    const result = await HrisUserAccount.findAll({
      attributes: ["user_id", "user_email"],
      include: [
        {
          model: HrisUserInfo,
          attributes: [
            "first_name",
            "middle_name",
            "last_name",
            "extension_name",
            "user_pic"
          ],
          required: false,
        },
        {
          model: HrisUserDesignation,
          attributes: ["upline_id"],
          include: [
            {
              model: CompanyJobTitle,
              attributes: ["job_title"],
              required: false
            },
          ],
          required: false,
        },
      ],
      order: [
        [HrisUserInfo, "last_name", "ASC"],
        [HrisUserInfo, "first_name", "ASC"],
      ],
      raw: false,
    });

    const employees = result.map(user => {
      const userPlain = user.get({ plain: true });

      const jobTitle = userPlain.HrisUserDesignations?.[0]?.CompanyJobTitle?.job_title || null;

      return {
        user_id: userPlain.user_id,
        user_email: userPlain.user_email,
        first_name: userPlain.HrisUserInfo?.first_name,
        middle_name: userPlain.HrisUserInfo?.middle_name,
        last_name: userPlain.HrisUserInfo?.last_name,
        extension_name: userPlain.HrisUserInfo?.extension_name,
        user_pic: userPlain.HrisUserInfo?.user_pic,
        job_title: jobTitle,
      };
    });

    return employees;

  } catch (error) {
    console.error("Error fetching employees for dropdown:", error);
    throw error;
  }
};


//get emp count
// service
exports.getEmployeeCounts = async () => {
  const phNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));

  const startOfMonth = new Date(phNow.getFullYear(), phNow.getMonth(), 1);
  const startOfNextMonth = new Date(phNow.getFullYear(), phNow.getMonth() + 1, 1);

  // Get all employment statuses
  const allStatuses = await HrisUserEmploymentStatus.findAll({
    attributes: ["employment_status_id", "employment_status"],
    raw: true,
  });

  const [
    countsByStatusRaw,
    activeCountResult,
    newHiresByStatusRaw,
    newSeparatedByStatusRaw,
    newRegularsRaw,
  ] = await Promise.all([
    // Counts by status (all employees)
    HrisUserEmploymentInfo.findAll({
      attributes: [
        "employment_status_id",
        [sequelize.fn("COUNT", sequelize.col("*")), "count"],
      ],
      include: [{ model: HrisUserEmploymentStatus, attributes: [], required: true }],
      group: ["employment_status_id"],
      raw: true,
    }),

    // Active count (not offboarded or separated)
    HrisUserEmploymentInfo.count({
      where: { date_offboarding: null, date_separated: null },
    }),

    // New hires by status this month
    HrisUserEmploymentInfo.findAll({
      attributes: [
        "employment_status_id",
        [sequelize.fn("COUNT", sequelize.col("*")), "newHiresThisMonth"],
      ],
      include: [{ model: HrisUserEmploymentStatus, attributes: [], required: true }],
      where: {
        date_hired: {
          [Op.gte]: startOfMonth,
          [Op.lt]: startOfNextMonth,
        },
      },
      group: ["employment_status_id"],
      raw: true,
    }),

    // New separations by status this month
    HrisUserEmploymentInfo.findAll({
      attributes: [
        "employment_status_id",
        [sequelize.fn("COUNT", sequelize.col("*")), "newSeparatedThisMonth"],
      ],
      include: [{ model: HrisUserEmploymentStatus, attributes: [], required: true }],
      where: {
        date_separated: {
          [Op.gte]: startOfMonth,
          [Op.lt]: startOfNextMonth,
        },
      },
      group: ["employment_status_id"],
      raw: true,
    }),

    // Regularizations this month
    HrisUserEmploymentInfo.findAll({
      attributes: [
        "employment_status_id",
        [sequelize.fn("COUNT", sequelize.col("*")), "newRegularThisMonth"],
      ],
      include: [
        { model: HrisUserEmploymentStatus, attributes: [], required: true },
      ],
      where: {
        date_regularization: {
          [Op.gte]: startOfMonth,
          [Op.lt]: startOfNextMonth,
        },
      },
      group: ["employment_status_id"],
      raw: true,
    }),
  ]);

  // Merge counts into statuses
  const mergeCountsWithStatuses = (
    allCountsData,
    newHiresData,
    newSeparatedData,
    newRegularsData,
    allStatuses
  ) => {
    const allCounts = allCountsData.map((item) => ({
      employment_status_id: item.employment_status_id,
      count: parseInt(item.count),
    }));

    const newHiresCounts = newHiresData.map((item) => ({
      employment_status_id: item.employment_status_id,
      newHiresThisMonth: parseInt(item.newHiresThisMonth),
    }));

    const newSeparatedCounts = newSeparatedData.map((item) => ({
      employment_status_id: item.employment_status_id,
      newSeparatedThisMonth: parseInt(item.newSeparatedThisMonth),
    }));

    const newRegularsCounts = newRegularsData.map((item) => ({
      employment_status_id: item.employment_status_id,
      newRegularThisMonth: parseInt(item.newRegularThisMonth),
    }));

    return allStatuses.map((status) => {
      const foundAllCount = allCounts.find(
        (item) => item.employment_status_id === status.employment_status_id
      );
      const foundNewHires = newHiresCounts.find(
        (item) => item.employment_status_id === status.employment_status_id
      );
      const foundNewSeparated = newSeparatedCounts.find(
        (item) => item.employment_status_id === status.employment_status_id
      );
      const foundNewRegulars = newRegularsCounts.find(
        (item) => item.employment_status_id === status.employment_status_id
      );

      let newThisMonth = 0;
      if (status.employment_status === "Separated") {
        newThisMonth = foundNewSeparated
          ? foundNewSeparated.newSeparatedThisMonth
          : 0;
      } else if (status.employment_status === "Regular") {
        newThisMonth = foundNewRegulars
          ? foundNewRegulars.newRegularThisMonth
          : 0;
      } else {
        newThisMonth = foundNewHires ? foundNewHires.newHiresThisMonth : 0;
      }

      return {
        employment_status_id: status.employment_status_id,
        employment_status: status.employment_status,
        count: foundAllCount ? foundAllCount.count : 0,
        newThisMonth,
      };
    });
  };

  return {
    countsByStatus: mergeCountsWithStatuses(
      countsByStatusRaw,
      newHiresByStatusRaw,
      newSeparatedByStatusRaw,
      newRegularsRaw,
      allStatuses
    ),
    activeCount: activeCountResult,
  };
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
            model: CompanyEmployer,
            attributes: ["company_employer_id", "company_employer_name"],
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
//         where: Object.keys(whereSalary).length ? whereSalary : undefined,
//         required: Object.keys(whereSalary).length ? true : false,
//       },
//       {
//         model: HrisUserEmploymentInfo,
//         include: [
//           { model: HrisUserJobLevel },
//           { model: HrisUserEmploymentStatus },
//           { model: HrisUserEmploymentType },
//           { model: HrisUserShiftsTemplate },
//         ],
//         where: Object.keys(whereEmploymentInfo).length
//           ? whereEmploymentInfo
//           : undefined,
//         required: Object.keys(whereEmploymentInfo).length ? true : false,
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
//           {
//             model: HrisUserAccount,
//             as: "upline",
//             include: [{ model: HrisUserInfo }],
//           },
//           { model: CompanyOffice },
//           { model: CompanyTeam },
//         ],
//         where: Object.keys(whereDesignation).length
//           ? whereDesignation
//           : undefined,
//         required: Object.keys(whereDesignation).length ? true : false,
//       },
//     ],
//   });
// };





// exports.findAllHrisUserAccountViaSearcyQuery = async (query) => {
//     return await HrisUserAccount.findAll({
//         where: {
//             [Op.or]: [
//                 {
//                     user_email: {
//                         [Op.like]: `%${query}%`,
//                     }
//                 },
//                 {
//                     '$HrisUserInfo.first_name$': {
//                         [Op.like]: `%${query}%`,
//                     }
//                 },
//                 {
//                     '$HrisUserInfo.last_name$': {
//                         [Op.like]: `%${query}%`,
//                     }
//                 }
//             ]
//         },
//         include: [
//             {
//                 model: HrisUserInfo,
//                 required: true // IMPORTANT for the $field$ syntax to work
//             },
//             {
//                 model: HrisUserAddress,
//             },
//             {
//                 model: HrisUserEmergencyContact,
//             },
//             {
//                 model: HrisUserHr201,
//             },
//             {
//                 model: HrisUserSalary,
//                 include: HrisUserSalaryAdjustmentType,
//             },
//             {
//                 model: HrisUserEmploymentInfo,
//                 include: [
//                     { model: HrisUserJobLevel },
//                     { model: HrisUserEmploymentStatus },
//                     { model: HrisUserEmploymentType },
//                     {
//                         model: HrisUserShiftsTemplate
//                     }
//                 ]
//             },
//             {
//                 model: HrisUserGovernmentId,
//                 include: HrisUserGovernmentIdType
//             },
//             {
//                 model: HrisUserDesignation,
//                 include: [
//                     {
//                         model: Company,
//                         include: [
//                             { model: CompanyAddress },
//                             {
//                                 model: CompanyInfo,
//                                 include: CompanyIndustry
//                             }
//                         ]
//                     },
//                     { model: CompanyJobTitle },
//                     { model: CompanyDepartment },
//                     { model: CompanyDivision },
//                     { model: HrisUserAccount }, // for upline
//                     { model: CompanyOffice },
//                     { model: CompanyTeam }
//                 ]
//             }
//         ]
//     });
// };


exports.findHrisUserAccountBasicInfo = async (user_id) => {
  const hrisUserInfo = await HrisUserInfo.findOne({
    attributes: [
      'user_id',
      'first_name',
      'last_name',
      'user_pic',
      'contact_number',
      [
        sequelize.literal(`(
                    SELECT user_email 
                    FROM hris_user_accounts 
                    WHERE hris_user_accounts.user_id = HrisUserInfo.user_id
                )`),
        'user_email'
      ],
      [
        sequelize.literal(`(
                    SELECT job_title 
                    FROM company_job_titles 
                    WHERE company_job_titles.job_title_id = (
                        SELECT job_title_id 
                        FROM hris_user_designations 
                        WHERE hris_user_designations.user_id = HrisUserInfo.user_id
                        LIMIT 1
                    )
                )`),
        'job_title'
      ]
    ],
    where: { user_id },
    raw: true
  });

  if (!hrisUserInfo) throw new Error(`No user found with the user_id: ${user_id}`);

  return hrisUserInfo;
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

exports.getLatestId = async () => {
  const latestUser = await HrisUserAccount.findOne({
    attributes: ["user_id"],
    order: [
      [
        HrisUserAccount.sequelize.literal(
          "CAST(SUBSTRING(user_id, 6) AS UNSIGNED)"
        ),
        "DESC",
      ],
    ],
  });

  return latestUser ? latestUser.user_id : null;
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
            `Deleted contact: ${existing.full_name || "null"} (${existing.contact_number || "null"
            })`
          );
          processedContactIds.add(existing.user_emergency_contact_id);
        } else {
          debugLogs.push(
            `No contact to delete: ${full_name || "null"} (${contact_number || "null"
            })`
          );
        }
        continue;
      }

      if ((!full_name || !contact_number) && !isAllEmpty) {
        debugLogs.push(
          `Keeping incomplete contact (not all empty): ${full_name || "null"
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
            `Deleted unlisted contact: ${existingContact.full_name || "null"
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

    const existingByType = new Map(
      existingAddresses.map((addr) => [addr.address_type.toUpperCase(), addr])
    );

    const processedTypes = new Set();

    for (const addr of addresses) {
      const {
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

      const typeKey = address_type?.toUpperCase();
      if (!typeKey || !["CURRENT", "PERMANENT"].includes(typeKey)) {
        debugLogs.push(`Skipped invalid address type: ${address_type}`);
        continue;
      }

      processedTypes.add(typeKey);

      const existing = existingByType.get(typeKey);

      if (existing) {
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
          },
          { transaction: t }
        );

        debugLogs.push(`Updated ${typeKey} address (${existing.user_address_id})`);
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
            address_type: typeKey,
          },
          { transaction: t }
        );

        debugLogs.push(`Inserted ${typeKey} address (${newId})`);
      }
    }

    for (const existing of existingAddresses) {
      const typeKey = existing.address_type.toUpperCase();
      if (!processedTypes.has(typeKey)) {
        await existing.destroy({ transaction: t });
        debugLogs.push(
          `Deleted ${typeKey} address (${existing.user_address_id})`
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
          { model: CompanyEmployer },
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
  if (!record) return null;

  const today = new Date();

  let newStatusId = null; // we'll store UUID FK here

  const hasSeparation = !!updatedFields.date_separated;
  const hasRegularization = !!updatedFields.date_regularization;

  const sepDate = hasSeparation ? new Date(updatedFields.date_separated) : null;
  const regDate = hasRegularization ? new Date(updatedFields.date_regularization) : null;

  // === DATE SEPARATED RULE (same as before) ===
  if (hasSeparation && sepDate <= today) {
    const status = await HrisUserEmploymentStatus.findOne({
      where: { employment_status: "separated" },
    });
    if (status) newStatusId = status.employment_status_id;
  }

  // === DATE REGULARIZATION RULE (new condition added)
  // Only set regular IF separated date is:
  // - not provided, OR
  // - is in the future
  if (!newStatusId && hasRegularization && regDate <= today) {
    if (!sepDate || sepDate > today) {
      const status = await HrisUserEmploymentStatus.findOne({
        where: { employment_status: "regular" },
      });
      if (status) newStatusId = status.employment_status_id;
    }
  }

  return await sequelize.transaction(async (t) => {
    // 1) Update employment timeline fields
    const [rowsUpdated] = await HrisUserEmploymentInfo.update(updatedFields, {
      where: { user_id },
      transaction: t,
    });

    if (rowsUpdated === 0) return null;

    // 2) If status should change, update FK
    if (newStatusId) {
      await HrisUserEmploymentInfo.update(
        { employment_status_id: newStatusId },
        { where: { user_id }, transaction: t }
      );
    }

    // 3) Return updated record
    const updatedEmploymentTimeline = await HrisUserEmploymentInfo.findOne({
      where: { user_id },
      transaction: t,
    });

    return updatedEmploymentTimeline;
  });
};

exports.findAllHrisUserAccountViaServiceAccess = async (service_id) => {
  return await HrisUserAccount.findAll({
    include: [
      {
        model: HrisUserInfo,
        required: true
      },
      {
        model: HrisUserServicePermission,
        required: true,
        where: {
          service_id
        }
      }
    ]
  });
};
