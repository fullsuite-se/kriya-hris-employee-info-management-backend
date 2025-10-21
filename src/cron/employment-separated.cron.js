const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const { Op } = require("sequelize");
const sequelize = require("../config/db.js");
const LogsActivity = require("../models/log-activity.model.js");
const HrisUserEmploymentInfo = require("../models/hris-user-employment-info.model.js");
const HrisUserEmploymentStatus = require("../models/hris-user-employment-status.model.js");

const startSeparationJob = () => {
    cron.schedule(
        "0 1 * * *",
        async () => {
            const today = dayjs().format("YYYY-MM-DD");
            console.log(`[Cron] Running separation check for ${today}`);

            const transaction = await sequelize.transaction();

            try {
                const separatedStatus = await HrisUserEmploymentStatus.findOne({
                    where: { employment_status: "Separated" },
                    transaction,
                });

                if (!separatedStatus) {
                    console.error("[Cron] 'Separated' status not found!");
                    await transaction.rollback();
                    return;
                }

                const separatedStatusId = separatedStatus.employment_status_id;

                const employeesToSeparate = await HrisUserEmploymentInfo.findAll({
                    where: {
                        date_separated: { [Op.lte]: today },
                        employment_status_id: { [Op.ne]: separatedStatusId },
                    },
                    transaction,
                });

                if (!employeesToSeparate.length) {
                    console.log("[Cron] No employees to mark as separated today or earlier.");
                    await transaction.commit();
                    return;
                }

                for (const emp of employeesToSeparate) {
                    await emp.update(
                        { employment_status_id: separatedStatusId },
                        { transaction }
                    );

                    await LogsActivity.create(
                        {
                            logs_activities_id: uuidv4(),
                            service_id: "s1",
                            company_id: "c1",
                            user_id: emp.user_id || null,
                            action: "Employment Status Update",
                            description: `Automatically changed status to 'Separated' for employee ${emp.user_id}`,
                            created_at: new Date(),
                        },
                        { transaction }
                    );
                }

                await transaction.commit();
                console.log(
                    `[Cron] Marked ${employeesToSeparate.length} employee(s) as Separated.`
                );
            } catch (error) {
                await transaction.rollback();
                console.error("[Cron] Error in separation job:", error);
            }
        },
        { timezone: "Asia/Manila" }
    );
};

module.exports = { startSeparationJob };
