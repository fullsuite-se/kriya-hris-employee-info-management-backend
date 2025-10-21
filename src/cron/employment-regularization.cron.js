const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const { Op } = require("sequelize");
const sequelize = require("../config/db.js");
const LogsActivity = require("../models/log-activity.model.js");
const HrisUserEmploymentInfo = require("../models/hris-user-employment-info.model.js");
const HrisUserEmploymentStatus = require("../models/hris-user-employment-status.model.js");

const startRegularizationJob = () => {
    cron.schedule(
        "0 0 * * *",
        async () => {
            const today = dayjs().format("YYYY-MM-DD");
            console.log(`[Cron] Running regularization check for ${today}`);

            const transaction = await sequelize.transaction();

            try {
                const [regularStatus, probationaryStatus] = await Promise.all([
                    HrisUserEmploymentStatus.findOne({
                        where: { employment_status: "Regular" },
                        transaction,
                    }),
                    HrisUserEmploymentStatus.findOne({
                        where: { employment_status: "Probationary" },
                        transaction,
                    }),
                ]);

                if (!regularStatus || !probationaryStatus) {
                    console.error("[Cron] Missing 'Regular' or 'Probationary' status records!");
                    await transaction.rollback();
                    return;
                }

                const regularStatusId = regularStatus.employment_status_id;
                const probationaryStatusId = probationaryStatus.employment_status_id;

                const employeesToRegularize = await HrisUserEmploymentInfo.findAll({
                    where: {
                        date_regularization: { [Op.lte]: today },
                        employment_status_id: probationaryStatusId,
                        date_offboarding: null,
                        date_separated: null,
                    },
                    transaction,
                });

                if (!employeesToRegularize.length) {
                    console.log("[Cron] No employees to regularize today or earlier.");
                    await transaction.commit();
                    return;
                }

                for (const emp of employeesToRegularize) {
                    await emp.update(
                        { employment_status_id: regularStatusId },
                        { transaction }
                    );

                    await LogsActivity.create(
                        {
                            logs_activities_id: uuidv4(),
                            service_id: "s1",
                            company_id: "c1",
                            user_id: emp.user_id || null,
                            action: "Employment Status Update",
                            description: `Automatically changed status from 'Probationary' to 'Regular' for employee ${emp.user_id}`,
                            created_at: new Date(),
                        },
                        { transaction }
                    );
                }

                await transaction.commit();
                console.log(
                    `[Cron] Successfully regularized ${employeesToRegularize.length} employee(s).`
                );
            } catch (error) {
                await transaction.rollback();
                console.error("[Cron] Error in regularization job:", error);
            }
        },
        { timezone: "Asia/Manila" }
    );
};

module.exports = { startRegularizationJob };
