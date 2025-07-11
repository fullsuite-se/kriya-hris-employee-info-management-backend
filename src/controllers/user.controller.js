const { findAllHrisUserAccount } = require("../services/user.service");

exports.getHrisUserAccounts = async (req, res) => {
    try {
        const hrisUserAccounts = await findAllHrisUserAccount();
        res.status(200).json({ message: "Users retrieved successfully", users: hrisUserAccounts })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hris user acccounts", error: error.message })
    }
}

// exports.getHrisUserAccount = async (req, res) => {
//     try {

//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch hris user acccount", error: error.message })
//     }
// }

// exports.createHrisUserAccount = async (req, res) => {
//     try {

//     } catch (error) {

//     }
// }