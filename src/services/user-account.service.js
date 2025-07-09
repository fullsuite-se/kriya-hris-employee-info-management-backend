const { UserAccount } = require("../models")

exports.findUserAccount = async () => {
    const userAccounts = await UserAccount.findAll();
    return userAccounts;
}
