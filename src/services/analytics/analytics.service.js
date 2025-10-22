const { Op, Sequelize, fn, col } = require('sequelize');
const { HrisUserEmploymentInfo, HrisUserInfo } = require('../../models');


exports.getMonthlyTrends = async (year = null) => {
    const targetYear = year || new Date().getFullYear();

    try {
        const hiringTrends = await fetchHiringTrends(targetYear);
        const separationTrends = await fetchSeparationTrends(targetYear);

        return formatMonthlyData(hiringTrends, separationTrends, targetYear);
    } catch (error) {
        throw new Error(`Failed to fetch monthly trends: ${error.message}`);
    }
};

exports.getAvailableYears = async () => {
    try {
        const hiringYears = await fetchHiringYears();
        const separationYears = await fetchSeparationYears();

        const allYears = [
            ...hiringYears.map(y => y.year),
            ...separationYears.map(y => y.year)
        ].filter(year => year !== null);

        return [...new Set(allYears)].sort((a, b) => b - a);
    } catch (error) {
        throw new Error(`Failed to fetch available years: ${error.message}`);
    }
};

const fetchHiringTrends = async (targetYear) => {
    return await HrisUserEmploymentInfo.findAll({
        attributes: [
            [Sequelize.fn('MONTH', Sequelize.col('date_hired')), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('user_employment_info_id')), 'count']
        ],
        where: {
            date_hired: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date_hired')), targetYear),
                    { [Op.ne]: null }
                ]
            }
        },
        group: [Sequelize.fn('MONTH', Sequelize.col('date_hired'))],
        order: [[Sequelize.fn('MONTH', Sequelize.col('date_hired')), 'ASC']],
        raw: true
    });
}

const fetchSeparationTrends = async (targetYear) => {
    return await HrisUserEmploymentInfo.findAll({
        attributes: [
            [Sequelize.fn('MONTH', Sequelize.col('date_separated')), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('user_employment_info_id')), 'count']
        ],
        where: {
            date_separated: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date_separated')), targetYear),
                    { [Op.ne]: null }
                ]
            }
        },
        group: [Sequelize.fn('MONTH', Sequelize.col('date_separated'))],
        order: [[Sequelize.fn('MONTH', Sequelize.col('date_separated')), 'ASC']],
        raw: true
    });
}

const fetchHiringYears = async () => {
    return await HrisUserEmploymentInfo.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.fn('YEAR', Sequelize.col('date_hired'))), 'year']
        ],
        where: { date_hired: { [Op.ne]: null } },
        order: [[Sequelize.fn('YEAR', Sequelize.col('date_hired')), 'DESC']],
        raw: true
    });
}

const fetchSeparationYears = async () => {
    return await HrisUserEmploymentInfo.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.fn('YEAR', Sequelize.col('date_separated'))), 'year']
        ],
        where: { date_separated: { [Op.ne]: null } },
        order: [[Sequelize.fn('YEAR', Sequelize.col('date_separated')), 'DESC']],
        raw: true
    });
}

const formatMonthlyData = (hiringData, separationData, year) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newHires = Array(12).fill(0);
    const separations = Array(12).fill(0);

    hiringData.forEach(item => {
        const index = item.month - 1;
        if (index >= 0 && index < 12) newHires[index] = parseInt(item.count);
    });

    separationData.forEach(item => {
        const index = item.month - 1;
        if (index >= 0 && index < 12) separations[index] = parseInt(item.count);
    });

    return {
        labels: months,
        datasets: [
            {
                label: 'New Employees',
                data: newHires,
                borderColor: '#008080',
                backgroundColor: 'rgba(0,128,128,0.2)',
                pointBackgroundColor: '#008080',
                pointBorderColor: '#fff',
                pointRadius: 5,
                fill: true
            },
            {
                label: 'Resigned Employees',
                data: separations,
                borderColor: '#cc5500',
                backgroundColor: 'rgba(204,85,0,0.2)',
                pointBackgroundColor: '#cc5500',
                pointBorderColor: '#fff',
                pointRadius: 5,
                fill: true
            }
        ],
        year
    };
}



exports.getAttritionRate = async (year = null) => {
    const targetYear = year || new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const attritionRates = [];

    for (const month of months) {
        const separations = await countSeparations(targetYear, month);
        const activeEmployees = await countActiveEmployeesAtMonthStart(targetYear, month);

        const rate = activeEmployees > 0
            ? (separations / activeEmployees) * 100
            : 0;

        attritionRates.push(parseFloat(rate.toFixed(2)));
    }

    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        attritionRates,
        year: targetYear
    };
};

const countSeparations = async (year, month) => {
    return await HrisUserEmploymentInfo.count({
        where: {
            date_separated: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date_separated')), year),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date_separated')), month)
                ]
            }
        }
    });
};

const countActiveEmployeesAtMonthStart = async (year, month) => {
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;

    return await HrisUserEmploymentInfo.count({
        where: {
            date_hired: { [Op.lte]: startOfMonth },
            [Op.or]: [
                { date_separated: null },
                { date_separated: { [Op.gt]: startOfMonth } }
            ]
        }
    });
};


exports.getSexDistribution = async () => {
    const results = await HrisUserInfo.findAll({
        attributes: [
            "sex",
            [fn("COUNT", col("sex")), "count"]
        ],
        where: {
            sex: {
                [Op.in]: ["Male", "Female"]
            }
        },
        group: ["sex"]
    });

    results.sort((a, b) => b.get("sex").localeCompare(a.get("sex")));

    const labels = results.map(r => r.get("sex"));
    const counts = results.map(r => Number(r.get("count")));
    const total = counts.reduce((sum, v) => sum + v, 0);

    const percentages = counts.map(c =>
        Number(((c / total) * 100).toFixed(2))
    );

    return { labels, counts, percentages, total };
};


exports.getAgeDistribution = async () => {
    const results = await HrisUserInfo.findAll({
        attributes: ['birthdate', 'sex'],
        where: {
            sex: {
                [Op.in]: ['Male', 'Female']
            }
        }
    });

    const ageGroups = {
        '18-25': { male: 0, female: 0 },
        '26-35': { male: 0, female: 0 },
        '36-45': { male: 0, female: 0 },
        '46-55': { male: 0, female: 0 },
        '56+': { male: 0, female: 0 },
    };

    const calculateAge = (birthdate) => {
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    results.forEach(user => {
        const age = calculateAge(user.birthdate);
        const sex = user.sex;

        if (age >= 18 && age <= 25) ageGroups['18-25'][sex.toLowerCase()]++;
        else if (age >= 26 && age <= 35) ageGroups['26-35'][sex.toLowerCase()]++;
        else if (age >= 36 && age <= 45) ageGroups['36-45'][sex.toLowerCase()]++;
        else if (age >= 46 && age <= 55) ageGroups['46-55'][sex.toLowerCase()]++;
        else if (age >= 56) ageGroups['56+'][sex.toLowerCase()]++;
    });

    const totalEmployees = results.length;

    const ageGroupsArray = Object.entries(ageGroups).map(([label, g]) => {
        const groupTotal = g.male + g.female;
        return {
            label,
            male: g.male,
            female: g.female,
            total: groupTotal,
            percentage: totalEmployees > 0 ? Number(((groupTotal / totalEmployees) * 100).toFixed(2)) : 0
        };
    });

    return {
        ageGroups: ageGroupsArray,
        total: totalEmployees
    };
};