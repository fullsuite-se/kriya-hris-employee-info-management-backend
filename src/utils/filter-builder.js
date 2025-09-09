const { Op } = require("sequelize");

function buildUserFilters(filters) {
  const {
    status,
    startdate,
    enddate,
    department,
    salaryMin,
    salaryMax,
    q,
    supervisor,
    job_position,
  } = filters;

  const whereAccount = {};
  const whereEmploymentInfo = {};
  const whereSalary = {};
  const whereDesignation = {};
  const whereInfo = {};

  if (status) {
    const list = status
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length) {
      whereEmploymentInfo.employment_status_id = { [Op.in]: list };
    }
  }

  if (startdate || enddate) {
    whereEmploymentInfo.date_hired = {};
    if (startdate) whereEmploymentInfo.date_hired[Op.gte] = new Date(startdate);
    if (enddate) whereEmploymentInfo.date_hired[Op.lte] = new Date(enddate);
  }

  if (salaryMin || salaryMax) {
    whereSalary.base_salary = {};
    if (salaryMin) whereSalary.base_salary[Op.gte] = Number(salaryMin);
    if (salaryMax) whereSalary.base_salary[Op.lte] = Number(salaryMax);
  }

  if (department) {
    const list = department
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    if (list.length) {
      whereDesignation.department_id = { [Op.in]: list };
    }
  }

  if (supervisor) {
    const list = supervisor
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    if (list.length) {
      whereDesignation.upline_id = { [Op.in]: list };
    }
  }
  if (job_position) {
    const list = job_position
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    if (list.length) {
      whereDesignation.job_title_id = { [Op.in]: list };
    }
  }
  

  if (q) {
    const like = { [Op.like]: `%${q}%` };
    whereInfo[Op.or] = [
      { first_name: like },
      { last_name: like },
      { middle_name: like },
    ];
    whereAccount.user_email = like;
  }

  return {
    whereAccount,
    whereEmploymentInfo,
    whereSalary,
    whereDesignation,
    whereInfo,
  };
}

module.exports = { buildUserFilters };
