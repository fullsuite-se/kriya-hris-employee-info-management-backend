const {
  prepareNewHrisUserAccountData,
} = require("../services/user-data-preprocessing.service");
const {
  // findAllHrisUserAccount,
  findHrisUserAccount,
  createHrisUserAccount,
  updatePersonalDetails,
  isUserIdTaken,
  updateContactInfo,
  updateGovernmentRemittances,
  updateEmergencyContacts,
  updateAddresses,
  updateHr201url,
  updateDesignation,
  updateEmploymentTimeline,
  // findAllHrisUserAccountViaFilter,
  getLatestId,
  findAllHrisUserAccounts,
} = require("../services/user.service");
const bcryptjs = require("bcryptjs");

// exports.getHrisUserAccounts = async (req, res) => {
//   const { query } = req.query;
//   try {
//     if (query) {
//       const hrisUserAccounts = await findAllHrisUserAccountViaSearchQuery(
//         query
//       );
//       return res.status(200).json({
//         message: "Users retrieved successfully",
//         users: hrisUserAccounts,
//       });
//     }

//     const hrisUserAccounts = await findAllHrisUserAccount();
//     res.status(200).json({
//       message: "Users retrieved successfully",
//       users: hrisUserAccounts,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch hris user acccounts",
//       error: error.message,
//     });
//   }
// };

// controller

exports.getHrisUserAccounts = async (req, res) => {
  try {
    const { include, ...filters } = req.query;

    const hrisUserAccounts = await findAllHrisUserAccounts({
      include,
      filters,
    });

    return res.status(200).json({
      message: "Users retrieved successfully",
      users: hrisUserAccounts,
      length: hrisUserAccounts.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hris user accounts",
      error: error.message,
    });
  }
};


exports.getHrisUserAccount = async (req, res) => {
  const { user_id } = req.params;

  try {
    const hrisUserAccount = await findHrisUserAccount(user_id);
    res
      .status(200)
      .json({ message: "User retrieved successfully", user: hrisUserAccount });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hris user acccount",
      error: error.message,
    });
  }
};

exports.createHrisUserAccount = async (req, res) => {
  const { system_user_id, system_user_email, system_company_id } = req.user;

  if ([system_user_id, system_user_email, system_company_id].some((v) => !v)) {
    return res.status(400).json({
      message:
        "Cannot extract system user. The client sent a malformed or incomplete request",
    });
  }

  const {
    // User account
    user_id,
    user_email,
    user_password,

    // User info
    first_name,
    middle_name,
    last_name,
    extension_name,
    sex,
    user_pic,
    personal_email,
    contact_number,
    birthdate,
    nickname,
    blood_type,
    civil_status,
    birth_place,

    //added
    nationality,
    height_cm,
    weight_kg,
    company_issued_phone_number,
    gender,

    // Designation
    job_title_id,
    department_id,
    division_id,
    upline_id,
    office_id,
    team_id,

    // Salary
    base_pay,
    salary_adjustment_type_id,
    date_salary_created,

    // CURRENT address fields
    currentBuildingNum,
    currentStreet,
    currentBarangay,
    currentCity,
    currentPostalCode,
    currentProvince,
    currentRegion,
    currentCountry,
    currentBarangayCode,
    currentCityCode,
    currentProvinceCode,
    currentRegionCode,

    // PERMANENT address fields
    permanentBuildingNum,
    permanentStreet,
    permanentBarangay,
    permanentCity,
    permanentPostalCode,
    permanentProvince,
    permanentRegion,
    permanentCountry,
    permanentBarangayCode,
    permanentCityCode,
    permanentProvinceCode,
    permanentRegionCode,

    // HR201
    hr201_url,

    // Employment
    shift_template_id,
    date_hired,
    date_regularization,
    date_offboarding,
    date_separated,
    employment_status_id,
    job_level_id,
    employment_type_id,

    // Arrays
    government_ids,
    emergency_contacts,
  } = req.body;

  const requiredFields = [
    "user_id",
    "user_email",
    "user_password",
    "first_name",
    "last_name",
    "personal_email",
    "job_title_id",
    // "base_pay",
    // "salary_adjustment_type_id",
    "date_salary_created",
    "shift_template_id",
    "date_hired",
    "employment_status_id",
    "job_level_id",
    "employment_type_id",

    //names
    "currentBarangay",
    "currentCity",
    "currentPostalCode",
    "currentProvince",
    "currentRegion",
    "currentCountry",
    //codes
    "currentBarangayCode",
    "currentCityCode",
    "currentProvinceCode",
    "currentRegionCode",

    //names
    "permanentBarangay",
    "permanentCity",
    "permanentPostalCode",
    "permanentProvince",
    "permanentRegion",
    "permanentCountry",
    //codes
    "permanentBarangayCode",
    "permanentCityCode",
    "permanentProvinceCode",
    "permanentRegionCode",

    //added
    "nationality",
    // "height_cm",
    // "weight_kg",
    // "company_issued_phone_number",
    // "gender",
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `The client sent a malformed or incomplete request. Missing fields: ${missingFields.join(
        ", "
      )}`,
    });
  }

  const userData = {
    user_id,
    user_email,
    user_password: await bcryptjs.hash(user_password, 10),

    first_name,
    middle_name: middle_name || null,
    last_name,
    extension_name: extension_name || null,
    sex: sex || null,
    user_pic: user_pic || null,
    personal_email,
    contact_number: contact_number || null,
    birthdate: birthdate || null,
    nickname: nickname || null,
    blood_type: blood_type || null,
    civil_status: civil_status || null,
    birth_place: birth_place || null,

    job_title_id,
    department_id: department_id || null,
    division_id: division_id || null,
    upline_id: upline_id || null,
    office_id: office_id || null,
    team_id: team_id || null,
    company_id: system_company_id,

    base_pay,
    salary_adjustment_type_id,
    date_salary_created,

    //added
    nationality,
    height_cm,
    weight_kg,
    company_issued_phone_number,
    gender,

    current_address: {
      building_num: currentBuildingNum || null,
      street: currentStreet || null,
      barangay: currentBarangay,
      city: currentCity,
      postal_code: currentPostalCode,
      province: currentProvince,
      region: currentRegion,
      country: currentCountry,
      //codes
      barangayCode: currentBarangayCode,
      cityCode: currentCityCode,
      provinceCode: currentProvinceCode,
      regionCode: currentRegionCode,

      address_type: "CURRENT",
    },

    permanent_address: {
      building_num: permanentBuildingNum || null,
      street: permanentStreet || null,
      barangay: permanentBarangay,
      city: permanentCity,
      postal_code: permanentPostalCode,
      province: permanentProvince,
      region: permanentRegion,
      country: permanentCountry,
      //codes
      barangayCode: permanentBarangayCode,
      cityCode: permanentCityCode,
      provinceCode: permanentProvinceCode,
      regionCode: permanentRegionCode,

      address_type: "PERMANENT",
    },

    hr201_url: hr201_url || null,

    shift_template_id,
    date_hired,
    date_regularization: date_regularization || null,
    date_offboarding: date_offboarding || null,
    date_separated: date_separated || null,
    employment_status_id,
    job_level_id,
    employment_type_id,

    government_ids: Array.isArray(government_ids)
      ? government_ids
      : [government_ids],

    emergency_contacts: Array.isArray(emergency_contacts)
      ? emergency_contacts
      : [emergency_contacts],
  };

  try {
    const {
      hrisUserAccountData,
      hrisUserInfoData,
      hrisUserDesignationData,
      hrisUserSalaryData,
      hrisUserAddressCurrentData,
      hrisUserAddressPermanentData,
      hrisUserHr201Data,
      hrisUserEmploymentInfoData,
      hrisUserGovernmentIdData,
      hrisUserEmergencyContactData,
    } = prepareNewHrisUserAccountData(
      system_user_id,
      system_user_email,
      system_company_id,
      userData
    );

    const newUser = await createHrisUserAccount(
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
    );

    return res.status(201).json({
      message: "User account created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating HRIS user account:", error);
    return res.status(500).json({
      message: "An error occurred while creating the user account",
      error: error.message,
    });
  }
};

exports.checkUserIdAvailability = async (req, res) => {
  const { user_id } = req.params;

  try {
    const isTaken = await isUserIdTaken(user_id);
    res.status(200).json({
      available: !isTaken,
      message: isTaken
        ? "Employee ID already taken"
        : "Employee ID is available",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check user ID availability",
      error: error.message,
    });
  }
};

exports.getLatestId = async (req, res) => {
  try {
    const latestId = await getLatestId();
    res.status(200).json({
      message: "Latest ID fetched successfully.",
      latestId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check user ID availability",
      error: error.message,
    });
  }
};
exports.updatePersonalDetails = async (req, res) => {
  const { user_id } = req.params;
  const { system_user_id } = req.user;

  if (!system_user_id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const {
    first_name,
    middle_name,
    last_name,
    nickname,
    extension_name,
    sex,
    gender,
    birthdate,
    birth_place,
    nationality,
    civil_status,
    height_cm,
    weight_kg,
    blood_type,
  } = req.body;

  console.log("req.body:", req.body);

  try {
    const updatedUserInfo = await updatePersonalDetails(user_id, {
      first_name,
      middle_name,
      last_name,
      nickname,
      extension_name,
      sex,
      gender,
      birthdate,
      birth_place,
      nationality,
      civil_status,
      height_cm,
      weight_kg,
      blood_type,
    });

    if (!updatedUserInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Personal details updated successfully",
      updatedUserInfo,
    });
  } catch (error) {
    console.error("Error updating personal details:", error);
    return res.status(500).json({
      message: "Failed to update personal details",
      error: error.message,
    });
  }
};

exports.updateContactInfo = async (req, res) => {
  const { user_id } = req.params;
  const { system_user_id } = req.user;

  if (!system_user_id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const {
    personal_email,
    company_issued_phone_number,
    contact_number,
    user_email,
  } = req.body;

  console.log("req.body:", req.body);

  try {
    const accountFields = {};
    if (user_email) accountFields.user_email = user_email;

    const infoFields = {};
    if (personal_email) infoFields.personal_email = personal_email;
    if (company_issued_phone_number)
      infoFields.company_issued_phone_number = company_issued_phone_number;
    if (contact_number) infoFields.contact_number = contact_number;

    const updatedUser = await updateContactInfo(
      user_id,
      accountFields,
      infoFields
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Contact info updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating contact info:", error);
    return res.status(500).json({
      message: "Failed to update contact info",
      error: error.message,
    });
  }
};

exports.updateGovernmentRemittances = async (req, res) => {
  const { user_id } = req.params;
  const { system_user_id } = req.user;

  if (!system_user_id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const governmentIds = req.body;

    const { updatedRecords, debugLogs } = await updateGovernmentRemittances(
      user_id,
      governmentIds
    );

    return res.status(200).json({
      message: "Government remittances updated successfully",
      updatedRemittances: updatedRecords,
      debugLogs,
    });
  } catch (error) {
    console.error("Error updating government remittances:", error);
    return res.status(500).json({
      message: "Failed to update government remittances",
      error: error.message,
    });
  }
};

exports.updateEmergencyContacts = async (req, res) => {
  const { user_id } = req.params;
  const { system_user_id } = req.user;

  if (!system_user_id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (
    !req.body ||
    typeof req.body !== "object" ||
    !Array.isArray(req.body.emergencyContacts)
  ) {
    return res.status(400).json({
      message:
        "Invalid request body. Expected format: { emergencyContacts: [...] }",
    });
  }

  try {
    const emergency_contacts = req.body.emergencyContacts;

    const { updatedRecords, debugLogs } = await updateEmergencyContacts(
      user_id,
      emergency_contacts
    );

    return res.status(200).json({
      message: "Emergency contacts updated successfully",
      updatedEmergencyContacts: updatedRecords,
      debugLogs,
    });
  } catch (error) {
    console.error("Error updating emergency contacts:", error);
    return res.status(500).json({
      message: "Failed to update emergency contacts",
      error: error.message,
    });
  }
};

exports.updateAddresses = async (req, res) => {
  const { user_id } = req.params;
  const { system_user_id } = req.user;

  if (!system_user_id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (
    !req.body ||
    typeof req.body !== "object" ||
    !Array.isArray(req.body.addresses)
  ) {
    return res.status(400).json({
      message: "Invalid request body. Expected format: { addresses: [...] }",
    });
  }

  try {
    const { updatedRecords, debugLogs } = await updateAddresses(
      user_id,
      req.body.addresses
    );

    return res.status(200).json({
      message: "Addresses updated successfully",
      updatedAddresses: updatedRecords,
      debugLogs,
    });
  } catch (error) {
    console.error("Error updating addresses:", error);
    return res.status(500).json({
      message: "Failed to update addresses",
      error: error.message,
    });
  }
};

exports.updateHr201url = async (req, res) => {
  const { user_id } = req.params;
  const { system_user_id } = req.user;

  if (!system_user_id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { hr201_url } = req.body;

  if (!hr201_url) {
    return res.status(400).json({ message: "hr201_url is required" });
  }

  try {
    const updatedHr201 = await updateHr201url(user_id, hr201_url);

    if (!updatedHr201) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "HR201 URL updated successfully",
      updatedHr201,
    });
  } catch (error) {
    console.error("Error updating HR201 URL:", error);
    return res.status(500).json({
      message: "Failed to update HR201 URL",
      error: error.message,
    });
  }
};

exports.updateDesignation = async (req, res) => {
  const { user_id } = req.params;
  const { system_user_id } = req.user;

  console.log("Controller: Starting updateDesignation", {
    user_id,
    system_user_id,
  });

  if (!system_user_id) {
    console.log("Controller: Unauthorized - No system_user_id");
    return res.status(403).json({ message: "Unauthorized" });
  }

  const {
    company_id,
    job_title_id,
    department_id,
    division_id,
    upline_id,
    office_id,
    team_id,
    shift_template_id,
    date_hired,
    date_regularization,
    date_offboarding,
    date_separated,
    employment_status_id,
    job_level_id,
    employment_type_id,
  } = req.body;

  console.log("Controller: Received request body", {
    company_id,
    job_title_id,
    department_id,
    division_id,
    upline_id,
    office_id,
    team_id,
    shift_template_id,
    date_hired,
    date_regularization,
    date_offboarding,
    date_separated,
    employment_status_id,
    job_level_id,
    employment_type_id,
  });

  // Designation update
  const designationFields = {};
  if (company_id) designationFields.company_id = company_id;
  if (job_title_id) designationFields.job_title_id = job_title_id;
  if (department_id) designationFields.department_id = department_id;
  if (division_id) designationFields.division_id = division_id;
  if (upline_id) designationFields.upline_id = upline_id;
  if (office_id) designationFields.office_id = office_id;
  if (team_id) designationFields.team_id = team_id;

  // Employment update
  const employmentFields = {};
  if (shift_template_id) employmentFields.shift_template_id = shift_template_id;
  if (date_hired) employmentFields.date_hired = date_hired;
  if (date_regularization)
    employmentFields.date_regularization = date_regularization;
  if (date_offboarding) employmentFields.date_offboarding = date_offboarding;
  if (date_separated) employmentFields.date_separated = date_separated;
  if (employment_status_id)
    employmentFields.employment_status_id = employment_status_id;
  if (job_level_id) employmentFields.job_level_id = job_level_id;
  if (employment_type_id)
    employmentFields.employment_type_id = employment_type_id;

  console.log("Controller: Prepared fields", {
    designationFields,
    employmentFields,
  });

  if (
    Object.keys(designationFields).length === 0 &&
    Object.keys(employmentFields).length === 0
  ) {
    console.log("Controller: No valid fields provided to update");
    return res
      .status(400)
      .json({ message: "No valid fields provided to update" });
  }

  try {
    const result = await updateDesignation(user_id, {
      designationFields,
      employmentFields,
    });

    if (!result) {
      console.log("Controller: User records not found for user_id", user_id);
      return res.status(404).json({ message: "User records not found" });
    }

    console.log("Controller: Update successful", result);
    return res.status(200).json({
      message: "Designation and/or Employment info updated successfully",
      designation: result.designation,
      employment: result.employment,
    });
  } catch (error) {
    console.error("Controller: Error updating designation/employment:", error);
    return res.status(500).json({
      message: "Failed to update designation/employment",
      error: error.message,
    });
  }
};

exports.updateEmploymentTimeline = async (req, res) => {
  const { user_id } = req.params;
  const { system_user_id } = req.user;

  if (!system_user_id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { date_hired, date_regularization, date_offboarding, date_separated } =
    req.body;

  console.log("req.body:", req.body);

  try {
    const updatedEmploymentTimeline = await updateEmploymentTimeline(user_id, {
      date_hired,
      date_regularization,
      date_offboarding,
      date_separated,
    });

    if (!updatedEmploymentTimeline) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Employment timeline updated successfully",
      timeline: updatedEmploymentTimeline,
    });
  } catch (error) {
    console.error("Error updating Employment timeline:", error);
    return res.status(500).json({
      message: "Failed to update Employment timeline",
      error: error.message,
    });
  }
};
