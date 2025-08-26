const { v4: uuidv4 } = require("uuid");
const crypto = require('crypto');
const env = require("../config/env");

exports.generateUUIV4 = () => {
    return uuidv4();
}

exports.generateAlphaNumericId = function (prefix = env.ID_PREFIX, num_length = env.ID_LENGTH) {
    const max = Math.pow(10, num_length);
    const randomNumber = crypto.randomInt(0, max)
        .toString()
        .padStart(num_length, '0');
    return `${prefix}-${randomNumber}`;
};