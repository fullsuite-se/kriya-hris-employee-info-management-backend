const { Op } = require("sequelize");
const { HrisUserAccount, HrisUserPasswordReset } = require("../models");
const { findUserByEmail } = require("./user.service");
const bcryptjs = require("bcryptjs");

exports.checkLoginCredentials = async (user_email, password) => {
  const user = await findUserByEmail(user_email);

  if (!user) throw new Error("User Not found");

  const passwordMatch = await bcryptjs.compare(password, user.user_password);

  if (!passwordMatch) throw new Error("Incorrect password");

  return user;
}

exports.checkServiceAccess = (service, servicePermissions) => {
  const servicePermissionsStringArray = servicePermissions.map(s => s.service_name);

  if (!servicePermissionsStringArray.includes(service)) {
    throw new Error("Unauthorized to access service");
  }

}




exports.requestPasswordHris = async (password_reset_id, user_id, otp_code, expires_at) => {
  try {
    const resetRequest = await HrisUserPasswordReset.create({
      password_reset_id,
      user_id,
      otp_code,
      expires_at,
      used: 0,
    });

    return resetRequest;
  } catch (error) {
    console.error("Error creating password reset request:", error);
    throw new Error("Failed to create password reset request");
  }
};


exports.verifyOTP = async (user_email, otp_code) => {
  try {
    const user = await HrisUserAccount.findOne({ where: { user_email } });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const otpRecord = await HrisUserPasswordReset.findOne({
      where: {
        user_id: user.user_id,
        otp_code,
        used: false,
        expires_at: { [Op.gt]: new Date() } 
      },
      order: [["expires_at", "DESC"]] 
    });

    if (!otpRecord) {
      return { success: false, message: "Invalid or expired OTP" };
    }


    return { success: true, user_id: user.user_id, message: "OTP verified successfully" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};


exports.resetPasswordHris = async (user_email, otp_code, new_password) => {
  const user = await HrisUserAccount.findOne({ where: { user_email } });
  if (!user) {
    throw new Error("User not found.");
  }

  const otpRecord = await HrisUserPasswordReset.findOne({
    where: {
      user_id: user.user_id,
      otp_code,
      used: false,
      expires_at: { [Op.gt]: new Date() }, 
    },
  });

  if (!otpRecord) {
    throw new Error("Invalid or expired OTP.");
  }

  const hashedPassword = await bcryptjs.hash(new_password, 10);

  await HrisUserAccount.update(
    { user_password: hashedPassword },
    { where: { user_id: user.user_id } }
  );

  otpRecord.used = true;
  await otpRecord.save();

  return "Password reset successful.";
};
