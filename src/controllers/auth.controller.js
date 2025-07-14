const jwt = require("jsonwebtoken");
const { checkLoginCredentials } = require("../services/auth.service");
require("dotenv").config();

exports.login = async (req, res) => {
    const { user_email, password } = req.body;

    if (!user_email || !password) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" })
    }

    try {
        const user = await checkLoginCredentials(user_email, password);

        const token = jwt.sign({
            user_id: user.user_id,
            user_email: user.user_email,
        },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        return res.status(200).json({ message: "Login successfully", token: token });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to login', error: error.message })
    }
}