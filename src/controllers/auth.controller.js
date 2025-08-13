const jwt = require("jsonwebtoken");
const { checkLoginCredentials, checkServiceAccess } = require("../services/auth.service");
const { getUserServicePermission } = require("../services/access-control/hris-user-service-permission.service");
const { getUserAccessPermissions } = require("../services/access-control/hris-user-access-permission.service");
require("dotenv").config();

exports.login = async (req, res) => {
    const { user_email, password, service } = req.body; //the service refer to the system trying to access the resources.

    if (!user_email || !password || !service) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" })
    }

    try {
        const user = await checkLoginCredentials(user_email, password);

        const servicePermissions = await getUserServicePermission(user.user_id);
        const accessPermissions = await getUserAccessPermissions(user.user_id);

        //check service
        checkServiceAccess(service, servicePermissions);

        const token = jwt.sign({
            system_user_id: user.user_id,
            system_user_email: user.user_email,
            system_company_id: user.HrisUserDesignations[0].Company.company_id,
            servicePermissions,
            accessPermissions,
        },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        return res.status(200).json({ message: "Login successfully", token: token });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to login', error: error.message })
    }
}