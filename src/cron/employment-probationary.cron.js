const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const { Op } = require("sequelize");
const sequelize = require("../config/db.js");
const LogsActivity = require("../models/log-activity.model.js");
const HrisUserEmploymentInfo = require("../models/hris-user-employment-info.model.js");
const HrisUserEmploymentStatus = require("../models/hris-user-employment-status.model.js");


const startProbationaryCheckJob = () => {
    cron.schedule(
        "20 0 * * *",
        async () => {
            const today = dayjs().format("YYYY-MM-DD");
            console.log(`[Cron] Running probationary check for ${today}`);

            const transaction = await sequelize.transaction();

            try {
                const probationaryStatus = await HrisUserEmploymentStatus.findOne({
                    where: { employment_status: "Probationary" },
                    transaction,
                });

                if (!probationaryStatus) {
                    console.error("[Cron] Missing 'Probationary' status record!");
                    await transaction.rollback();
                    return;
                }

                const probationaryStatusId = probationaryStatus.employment_status_id;

                const employeesToProbation = await HrisUserEmploymentInfo.findAll({
                    where: {
                        date_regularization: { [Op.gt]: today },
                        employment_status_id: { [Op.not]: probationaryStatusId },
                        date_offboarding: null,
                        date_separated: null,
                    },
                    transaction,
                });

                if (!employeesToProbation.length) {
                    console.log("[Cron] No employees to set as probationary.");
                    await transaction.commit();
                    return;
                }

                for (const emp of employeesToProbation) {
                    await emp.update(
                        { employment_status_id: probationaryStatusId },
                        { transaction }
                    );

                    await LogsActivity.create(
                        {
                            logs_activities_id: uuidv4(),
                            service_id: "s1",
                            company_id: "c1",
                            user_id: emp.user_id || null,
                            action: "Employment Status Update",
                            description: `Automatically changed status to 'Probationary' for employee ${emp.user_id} (regularization date in the future)`,
                            created_at: new Date(),
                        },
                        { transaction }
                    );
                }

                await transaction.commit();
                console.log(
                    `[Cron] Successfully updated ${employeesToProbation.length} employee(s) to Probationary.`
                );
            } catch (error) {
                await transaction.rollback();
                console.error("[Cron] Error in probationary check job:", error);
            }
        },
        { timezone: "Asia/Manila" }
    );
};

module.exports = { startProbationaryCheckJob };
