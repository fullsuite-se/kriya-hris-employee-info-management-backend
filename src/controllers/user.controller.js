const { prepareNewHrisUserAccountData } = require("../services/user-data-preprocessing.service");
const { findAllHrisUserAccount, findHrisUserAccount, findAllHrisUserAccountViaSearcyQuery, createHrisUserAccount } = require("../services/user.service");
const bcryptjs = require('bcryptjs');

exports.getHrisUserAccounts = async (req, res) => {
    const { query } = req.query;
    try {
        if (query) {
            const hrisUserAccounts = await findAllHrisUserAccountViaSearcyQuery(query);
            return res.status(200).json({ message: "Users retrieved successfully", users: hrisUserAccounts })
        }

        const hrisUserAccounts = await findAllHrisUserAccount();
        res.status(200).json({ message: "Users retrieved successfully", users: hrisUserAccounts })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hris user acccounts", error: error.message })
    }
}

exports.getHrisUserAccount = async (req, res) => {
    const { user_id } = req.params;

    try {
        const hrisUserAccount = await findHrisUserAccount(user_id);
        res.status(200).json({ message: "User retrieved successfully", users: hrisUserAccount })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hris user acccount", error: error.message })
    }
}

exports.createHrisUserAccount = async (req, res) => {
    const { system_user_id, system_user_email, system_company_id } = req.user;

    if ([system_user_id, system_user_email, system_company_id].some(v => !v)) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" });
    }

    const {
        //hris_user_accounts
        user_id,
        user_email,
        user_password,

        //hris_user_infos
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

        //hris_user_designations
        job_title_id,
        department_id,
        division_id,
        upline_id,
        office_id,
        team_id,

        //hris_user_salaries
        base_pay,
        salary_adjustment_type_id,
        date,

        //hris_user_addresses
        building_num,
        street,
        barangay,
        city,
        postal_code,
        province,
        region,
        country,
        address_type,

        //hris_user_hr201
        hr201_url,

        //hris_user_employment_infos
        shift_template_id,
        date_hired,
        date_regularization,
        date_offboarding,
        date_separated,
        employment_status_id,
        job_level_id,
        employment_type_id,
    } = req.body;

    // Array of { government_id_type_id, government_id_number }
    // Array of { first_name, middle_name, last_name, extension_name, contact_number }
    let { government_ids, emergency_contacts } = req.body;

    //convert government_ids, emergency_contacts  into arrays
    if (!Array.isArray(government_ids)) {
        government_ids = [government_ids];
    }

    if (!Array.isArray(emergency_contacts)) {
        emergency_contacts = [emergency_contacts];
    }


    if (![
        //hris_user_accounts
        user_id,
        user_email,
        user_password,

        //hris_user_info
        first_name,
        last_name,
        personal_email,


        //hris_user_designations
        job_title_id,


        //hris_user_addresses
        barangay,
        city,
        postal_code,
        province,
        region,
        country,
        address_type,

        //hris_user_employment_infos
        shift_template_id,
        date_hired,
        employment_status_id,
        job_level_id,
        employment_type_id,

        //hris_user_salaries
        base_pay,
        salary_adjustment_type_id,
        date,

    ].some(v => !v)) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" });
    }


    const userData = {
        // User account
        user_id,
        user_email,
        user_password: await bcryptjs.hash(user_password, 10),

        // User info
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

        // Designation
        job_title_id,
        department_id: department_id || null,
        division_id: division_id || null,
        upline_id: upline_id || null,
        office_id: office_id || null,
        team_id: team_id || null,
        company_id: system_company_id,

        // Salary
        base_pay,
        salary_adjustment_type_id,
        date,

        // Address
        building_num: building_num || null,
        street: street || null,
        barangay,
        city,
        postal_code,
        province,
        region,
        country,
        address_type,

        //hris_user_hr201
        hr201_url: hr201_url || null,

        //hris_user_employment_infos
        shift_template_id,
        date_hired,
        date_regularization: date_regularization || null,
        date_offboarding: date_offboarding || null,
        date_separated: date_separated || null,
        employment_status_id,
        job_level_id,
        employment_type_id,

        // governement ids and em. contacts
        government_ids,
        emergency_contacts
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
            hrisUserEmergencyContactData
        } = prepareNewHrisUserAccountData(system_user_id, system_user_email, system_company_id, userData);

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
            data: {
                user_id: newUser.userAccount.user_id,
                user_email: newUser.userAccount.user_email
            }
        });
    } catch (error) {
        console.error("Error creating HRIS user account:", error);
        return res.status(500).json({
            message: "An error occurred while creating the user account",
            error: error.message
        });
    }
};