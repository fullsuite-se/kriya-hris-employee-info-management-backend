const { findUserByEmail } = require("./user.service");
const bcryptjs = require("bcryptjs");

exports.checkLoginCredentials = async (user_email, password) => {
    const user = await findUserByEmail(user_email);

    if (!user) throw new Error("User Not found");

    const passwordMatch = await bcryptjs.compare(password, user.user_password);

    if (!passwordMatch) throw new Error("Incorrect password");

    return user;
}