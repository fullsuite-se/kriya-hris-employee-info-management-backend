const jwt = require("jsonwebtoken");
const env = require("../config/env");

//strict rule
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





exports.authenticateAPIKey = (req, res, next) => {
    const client_shared_api_key = req.headers['x-api-key'];

    if (!client_shared_api_key) return res.status(401).json({ message: "Unauthorized access. No api key" });

    if (client_shared_api_key != env.SHARED_API_KEY) {
        return res.status(401).json({ message: "Unauthorized access. Invalid api key" });
    };
    next();
};