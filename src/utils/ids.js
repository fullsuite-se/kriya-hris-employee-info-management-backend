const { v4: uuidv4 } = require("uuid");
const crypto = require('crypto');
require("dotenv").config();

exports.generateUUIV4 = () => {
    return uuidv4();
}

exports.generateAlphaNumericId = function (prefix = process.env.ID_PREFIX, num_length = process.env.ID_LENGTH) {
    const max = Math.pow(10, num_length);
    const randomNumber = crypto.randomInt(0, max)
        .toString()
        .padStart(num_length, '0');
    return `${prefix}-${randomNumber}`;
};