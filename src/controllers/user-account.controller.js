const { findUserAccount } = require("../services/user-account.service");

exports.findUserAccount = async (req, res) => {
    const userAccounts = await findUserAccount();
    return res.status(200).json({ message: "Successfully retrieved", users: userAccounts })
};