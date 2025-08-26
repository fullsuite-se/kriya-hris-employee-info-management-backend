const { generateUUIV4 } = require("../utils/ids");
const { getCreatedUpdatedIsoUTCNow } = require("../utils/date");

exports.prepareNewHrisUserAccountData = (
  system_user_id,
  system_user_email,
  system_company_id,
  userData
) => {
  const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

  const hrisUserAccountData = {
    user_id: userData.user_id,
    user_email: userData.user_email,
    user_password: userData.user_password,
    created_at,
    created_by: system_user_id,
  };

  const hrisUserInfoData = {
    user_info_id: generateUUIV4(),
    user_id: userData.user_id,
    first_name: userData.first_name,
    middle_name: userData.middle_name,
    last_name: userData.last_name,
    extension_name: userData.extension_name,
    sex: userData.sex,
    user_pic: userData.user_pic,
    personal_email: userData.personal_email,
    contact_number: userData.contact_number,
    birthdate: userData.birthdate,
    nickname: userData.nickname,
    blood_type: userData.blood_type,
    civil_status: userData.civil_status,
    birth_place: userData.birth_place,
    //added
    nationality: userData.nationality,
    height_cm: userData.height_cm,
    weight_kg: userData.weight_kg,
    company_issued_phone_number: userData.company_issued_phone_number,
    gender: userData.gender,
  };

  const hrisUserDesignationData = {
    user_designation_id: generateUUIV4(),
    user_id: userData.user_id,
    company_id: system_company_id,
    job_title_id: userData.job_title_id,
    department_id: userData.department_id,
    division_id: userData.division_id,
    upline_id: userData.upline_id,
    office_id: userData.office_id,
    team_id: userData.team_id,
  };

  const hrisUserSalaryData = {
    user_salary_id: generateUUIV4(),
    user_id: userData.user_id,
    base_pay: userData.base_pay,
    salary_adjustment_type_id: userData.salary_adjustment_type_id,
    date_salary_created: userData.date_salary_created,
    created_at,
    updated_at,
  };

  // CURRENT ADDRESS
  const hrisUserAddressCurrentData = {
    user_address_id: generateUUIV4(),
    user_id: userData.user_id,
    building_num: userData.current_address.building_num,
    street: userData.current_address.street,
    barangay: userData.current_address.barangay,
    city: userData.current_address.city,
    postal_code: userData.current_address.postal_code,
    province: userData.current_address.province,
    region: userData.current_address.region,
    country: userData.current_address.country,
    //codes
    barangayCode: userData.current_address.barangayCode,
    cityCode: userData.current_address.cityCode,
    provinceCode: userData.current_address.provinceCode,
    regionCode: userData.current_address.regionCode,
    address_type: "CURRENT",
  };

  // PERMANENT ADDRESS
  const hrisUserAddressPermanentData = {
    user_address_id: generateUUIV4(),
    user_id: userData.user_id,
    building_num: userData.permanent_address.building_num,
    street: userData.permanent_address.street,
    barangay: userData.permanent_address.barangay,
    city: userData.permanent_address.city,
    postal_code: userData.permanent_address.postal_code,
    province: userData.permanent_address.province,
    region: userData.permanent_address.region,
    country: userData.permanent_address.country,
    //codes
    barangayCode: userData.permanent_address.barangayCode,
    cityCode: userData.permanent_address.cityCode,
    provinceCode: userData.permanent_address.provinceCode,
    regionCode: userData.permanent_address.regionCode,
    address_type: "PERMANENT",
  };

  const hrisUserHr201Data = {
    hr201_id: generateUUIV4(),
    user_id: userData.user_id,
    hr201_url: userData.hr201_url,
    created_at,
    updated_at,
  };

  const hrisUserEmploymentInfoData = {
    user_employment_info_id: generateUUIV4(),
    user_id: userData.user_id,
    shift_template_id: userData.shift_template_id,
    date_hired: userData.date_hired,
    date_regularization: userData.date_regularization,
    date_offboarding: userData.date_offboarding,
    date_separated: userData.date_separated,
    employment_status_id: userData.employment_status_id,
    job_level_id: userData.job_level_id,
    employment_type_id: userData.employment_type_id,
  };

  const hrisUserGovernmentIdData = userData.government_ids.map((userGovId) => ({
    user_government_id: generateUUIV4(),
    government_id_type_id: userGovId.government_id_type_id,
    government_id_number: userGovId.government_id_number,
    user_id: userData.user_id,
  }));

  const hrisUserEmergencyContactData = userData.emergency_contacts.map(
    (userEmContact) => ({
      user_emergency_contact_id: generateUUIV4(),
      user_id: userData.user_id,
      full_name: userEmContact.full_name,
      contact_number: userEmContact.contact_number,
      relationship: userEmContact.relationship,
    })
  );

  return {
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
  };
};
