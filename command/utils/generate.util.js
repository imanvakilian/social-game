const { randomInt } = require('crypto');
function generateOtp(userId, method) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
    const otp = {
        userId,
        code,
        expiresIn,
        method,
    };
    return otp;
};

module.exports = {
    generateOtp,
};