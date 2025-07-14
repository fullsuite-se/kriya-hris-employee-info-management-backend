const { findAllHrisUserAccount, findHrisUserAccount, findAllHrisUserAccountViaSearcyQuery } = require("../services/user.service");

exports.getHrisUserAccounts = async (req, res) => {
    const { query } = req.query;
    try {
        if (query) {
            const hrisUserAccounts = await findAllHrisUserAccountViaSearcyQuery(query);
            return res.status(200).json({ message: "Users retrieved successfully", users: hrisUserAccounts })
        }

        const hrisUserAccounts = await findAllHrisUserAccount();
        res.status(200).json({ message: "Users retrieved successfully", users: hrisUserAccounts })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hris user acccounts", error: error.message })
    }
}

exports.getHrisUserAccount = async (req, res) => {
    const { user_id } = req.params;

    try {
        const hrisUserAccount = await findHrisUserAccount(user_id);
        res.status(200).json({ message: "User retrieved successfully", users: hrisUserAccount })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hris user acccount", error: error.message })
    }
}