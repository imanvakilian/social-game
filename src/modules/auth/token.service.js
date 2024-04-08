const createHttpError = require("http-errors");
const jwt = require('jsonwebtoken');
const HelpEnv = require("../../../command/utils/helpENV");
const { badRequestMessage, authMessage } = require("../../../command/messages/public.message");

class JwtTokenService extends HelpEnv {

    createOtpToken(payload, next) {
        try {
            // paylaod => {userId}
            return jwt.sign(payload, process.env.JWT_OTP_SECRET, { expiresIn: "2m" });
        } catch (error) {
            next(error);
        }
    }

    verifyOtpToken(token, next) {
        try {
            return jwt.verify(token, process.env.JWT_OTP_SECRET);
        } catch (error) {
            next(error);
        }
    }

    createAccessToken(payload, next) {
        try {
            // paylaod => {userId}
            return jwt.sign(payload, process.env.JWT_ACCESSTOKEN_SECRET, { expiresIn: "30d" });
        } catch (error) {
            next(error);
        }
    }

    verifyAccessToken(token, next) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESSTOKEN_SECRET);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new JwtTokenService();