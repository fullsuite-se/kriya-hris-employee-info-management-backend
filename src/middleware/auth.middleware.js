const jwt = require("jsonwebtoken");
const env = require("../config/env");

exports.authenticateJWTToken = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Unauthorized access. No token" });

    jwt.verify(token, env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        req.user = user;

        next();
    });
}