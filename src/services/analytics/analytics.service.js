const { Op, Sequelize, fn, col, literal } = require('sequelize');
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

    // Fetch all employees that were active at any point in the year
    const employees = await HrisUserEmploymentInfo.findAll({
        attributes: ['date_hired', 'date_separated'],
        where: {
            date_hired: { [Op.lte]: new Date(targetYear, 11, 31) }, // hired before end of year
            [Op.or]: [
                { date_separated: null },
                { date_separated: { [Op.gte]: new Date(targetYear, 0, 1) } } // separated after start of year
            ]
        },
        raw: true
    });


    const daysInYear = 365 + (new Date(targetYear, 1, 29).getDate() === 29 ? 1 : 0); // account for leap year
    const dailyEvents = Array.from({ length: daysInYear }, () => 0); // index 0 = Jan 1

    // Map date to day-of-year index
    const getDayIndex = (date) => {
        const start = new Date(targetYear, 0, 1);
        return Math.floor((date - start) / (1000 * 60 * 60 * 24));
    };

    // Populate daily events (+1 for hire, -1 for separation)
    employees.forEach(emp => {
        const hireDate = new Date(emp.date_hired);
        if (hireDate.getFullYear() === targetYear) {
            dailyEvents[getDayIndex(hireDate)] += 1;
        } else if (hireDate < new Date(targetYear, 0, 1)) {
            dailyEvents[0] += 1; // already employed at start of year
        }

        if (emp.date_separated) {
            const sepDate = new Date(emp.date_separated);
            if (sepDate.getFullYear() === targetYear) {
                dailyEvents[getDayIndex(sepDate)] -= 1;
            }
        }
    });

    // Compute cumulative daily employees
    let cumulative = 0;
    const dailyActive = [];

    for (let i = 0; i < dailyEvents.length; i++) {
        cumulative += dailyEvents[i];
        dailyActive.push(cumulative);
    }

    // Compute attrition per month
    const attritionData = [];

    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(targetYear, month + 1, 0).getDate();
        const monthStartIndex = getDayIndex(new Date(targetYear, month, 1));
        const monthEndIndex = monthStartIndex + daysInMonth - 1;

        // Average employees in the month
        const totalActive = dailyActive.slice(monthStartIndex, monthEndIndex + 1).reduce((a, b) => a + b, 0);
        const avgEmployees = totalActive / daysInMonth;

        // Total separations in the month
        const separations = employees.filter(emp => {
            if (!emp.date_separated) return false;
            const sep = new Date(emp.date_separated);
            return sep.getFullYear() === targetYear && sep.getMonth() === month;
        }).length;

        const attritionRate = avgEmployees > 0 ? (separations / avgEmployees) * 100 : 0;

        attritionData.push({
            month: month + 1,
            separations,
            avgEmployees: parseFloat(avgEmployees.toFixed(2)),
            attritionRate: parseFloat(attritionRate.toFixed(2))
        });
    }

    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: attritionData,
        year: targetYear
    };
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


exports.getTenureDistribution = async () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const todayStr = today.toISOString().split("T")[0];

    const results = await HrisUserInfo.findAll({
        attributes: [
            "sex",
            [
                literal(`
          CASE
            WHEN TIMESTAMPDIFF(MONTH, employmentInfo.date_hired, '${todayStr}') <= 6 THEN '0-6 mos'
            WHEN TIMESTAMPDIFF(MONTH, employmentInfo.date_hired, '${todayStr}') <= 12 THEN '7mos-1yr'
            WHEN TIMESTAMPDIFF(YEAR, employmentInfo.date_hired, '${todayStr}') <= 4 THEN '2-4 yrs'
            WHEN TIMESTAMPDIFF(YEAR, employmentInfo.date_hired, '${todayStr}') <= 7 THEN '5-7 yrs'
            WHEN TIMESTAMPDIFF(YEAR, employmentInfo.date_hired, '${todayStr}') <= 10 THEN '8-10 yrs'
            ELSE '10+ yrs'
          END
                `),
                "tenureGroup",
            ],
            [
                literal(`
          CASE
            WHEN (${currentYear} - YEAR(birthdate)) BETWEEN 18 AND 24 THEN '18-24'
            WHEN (${currentYear} - YEAR(birthdate)) BETWEEN 25 AND 34 THEN '25-34'
            WHEN (${currentYear} - YEAR(birthdate)) BETWEEN 35 AND 44 THEN '35-44'
            WHEN (${currentYear} - YEAR(birthdate)) BETWEEN 45 AND 54 THEN '45-54'
            WHEN (${currentYear} - YEAR(birthdate)) >= 55 THEN '55+'
            ELSE 'Under 18'
          END
                `),
                "ageGroup",
            ],
            [fn("COUNT", col("HrisUserInfo.user_info_id")), "count"],
        ],
        include: [
            {
                model: HrisUserEmploymentInfo,
                as: "employmentInfo",
                attributes: [],
                required: true,
            },
        ],
        where: {
            sex: { [Op.in]: ["Male", "Female"] },
            "$employmentInfo.date_hired$": { [Op.not]: null },
            birthdate: { [Op.not]: null },
        },
        group: ["ageGroup", "tenureGroup", "sex"],
        raw: true,
    });

    // Define age brackets in order (starting at 18)
    const ageBrackets = ["18-24", "25-34", "35-44", "45-54", "55+"];
    // Define tenure groups with new ranges
    const tenureGroups = ["0-6 mos", "7mos-1yr", "2-4 yrs", "5-7 yrs", "8-10 yrs", "10+ yrs"];

    // Initialize data structure
    const distribution = {};

    // Initialize all age brackets with empty tenure groups
    ageBrackets.forEach(ageBracket => {
        distribution[ageBracket] = {
            "0-6 mos": { Male: 0, Female: 0, Total: 0 },
            "7mos-1yr": { Male: 0, Female: 0, Total: 0 },
            "2-4 yrs": { Male: 0, Female: 0, Total: 0 },
            "5-7 yrs": { Male: 0, Female: 0, Total: 0 },
            "8-10 yrs": { Male: 0, Female: 0, Total: 0 },
            "10+ yrs": { Male: 0, Female: 0, Total: 0 },
            total: 0
        };
    });

    // Populate with actual counts
    results.forEach((r) => {
        if (distribution[r.ageGroup] && distribution[r.ageGroup][r.tenureGroup]) {
            distribution[r.ageGroup][r.tenureGroup][r.sex] = Number(r.count);
            distribution[r.ageGroup][r.tenureGroup].Total += Number(r.count);
            distribution[r.ageGroup].total += Number(r.count);
        }
    });

    // Calculate percentages for each age bracket
    const percentageData = {};

    ageBrackets.forEach(ageBracket => {
        percentageData[ageBracket] = {
            "0-6 mos": { Male: 0, Female: 0 },
            "7mos-1yr": { Male: 0, Female: 0 },
            "2-4 yrs": { Male: 0, Female: 0 },
            "5-7 yrs": { Male: 0, Female: 0 },
            "8-10 yrs": { Male: 0, Female: 0 },
            "10+ yrs": { Male: 0, Female: 0 }
        };

        const ageGroupTotal = distribution[ageBracket].total;

        if (ageGroupTotal > 0) {
            tenureGroups.forEach(tenureGroup => {
                const maleCount = distribution[ageBracket][tenureGroup].Male;
                const femaleCount = distribution[ageBracket][tenureGroup].Female;

                percentageData[ageBracket][tenureGroup].Male = Math.round((maleCount / ageGroupTotal) * 100 * 100) / 100;
                percentageData[ageBracket][tenureGroup].Female = Math.round((femaleCount / ageGroupTotal) * 100 * 100) / 100;
            });
        }
    });

    // Format for chart output
    const chartData = {
        ageBrackets: ageBrackets,
        tenureGroups: tenureGroups,
        counts: distribution,
        percentages: percentageData,
        series: []
    };

    // Create series data for each tenure group (stacked bars)
    tenureGroups.forEach(tenureGroup => {
        const maleData = ageBrackets.map(ageBracket =>
            percentageData[ageBracket][tenureGroup].Male
        );
        const femaleData = ageBrackets.map(ageBracket =>
            percentageData[ageBracket][tenureGroup].Female
        );

        chartData.series.push({
            tenureGroup: tenureGroup,
            male: maleData,
            female: femaleData,
            total: ageBrackets.map(ageBracket =>
                Math.round((percentageData[ageBracket][tenureGroup].Male + percentageData[ageBracket][tenureGroup].Female) * 100) / 100
            )
        });
    });

    return chartData;
};
