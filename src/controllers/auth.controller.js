const jwt = require("jsonwebtoken");
const { checkLoginCredentials, checkServiceAccess, requestPasswordHris, verifyOTP, resetPasswordHris } = require("../services/auth.service");
const { getUserServicePermission } = require("../services/access-control/hris-user-service-permission.service");
const { getUserAccessPermissions } = require("../services/access-control/hris-user-access-permission.service");
const env = require("../config/env");
const transporter = require("../config/transporter.js");
const { v4: uuidv4 } = require("uuid");
const HrisUserAccount = require("../models/hris-user-account.model.js");


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
            env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successfully", token: token });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to login', error: error.message })
    }
}


exports.requestResetPasswordHris = async (req, res) => {
    try {
        const { user_email } = req.body;

        const user = await HrisUserAccount.findOne({ where: { user_email } });

        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }

        const password_reset_id = uuidv4();
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await requestPasswordHris(password_reset_id, user.user_id, otp, expiresAt);

        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_USER_HRIS,
            to: user_email,
            subject: "FULLSUITE - Request Password Reset",
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0097b2;">FULLSUITE Password Reset OTP</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your account.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="text-align: center; margin: 15px 0;">
            <div style="background-color: #0097b2; color: white; padding: 12px 24px; 
                        border-radius: 5px; display: inline-block; font-weight: bold; 
                        font-size: 18px; letter-spacing: 2px;">
              ${otp}
            </div>
          </div>
          <p><strong>This OTP is valid for 10 minutes.</strong> After it expires, please request a new one.</p>
          <p>If you did not request this reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <p style="color: #777; font-size: 12px;">For security reasons, this OTP will expire in 10 minutes.</p>
        </div>
      `,
        });

        return res.status(200).json({ message: "OTP sent successfully", info: info.response });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { user_email, otp_code } = req.body;

        const result = await verifyOTP(user_email, otp_code);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({ message: result.message, user_id: result.user_id });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: error.message });
    }
};


exports.resetPasswordHris = async (req, res) => {
    try {
        const { user_email, otp_code, new_password } = req.body;

        const message = await resetPasswordHris(user_email, otp_code, new_password);

        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_USER_HRIS,
            to: user_email,
            subject: "FULLSUITE - Password Reset Successful",
            html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #0097b2;">Password Reset Successful</h2>
                    <p>Hello,</p>
                    <p>This is to confirm that the password for your account has been successfully updated.</p>
                    <p>If you performed this action, no further steps are needed.</p>
                    <p>If you did <strong>not</strong> reset your password, please contact our support team immediately to secure your account.</p>
                    <p style="color: #777; font-size: 12px;">For your security, we recommend regularly updating your password and not sharing it with anyone.</p>
                    </div>
                `,
        });


        return res.status(200).json({ message, info: info.response });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: error.message });
    }
};
