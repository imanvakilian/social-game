const createHttpError = require("http-errors");
const jwt = require('jsonwebtoken');
const { authMessage } = require("../../../../command/messages/public.message");
const TokenService = require("../token.service");
const UserService = require("../../user/user.service");

async function checkAccessToken(req, res, next) {
    try {
        const authorization = req?.headers?.authorization;
        if (!authorization) throw new createHttpError.Unauthorized(authMessage.authFailed);
        const [bearer, token] = authorization.split(" ");
        if (bearer.toLowerCase() !== "bearer" || !token) throw new createHttpError.Unauthorized(authMessage.authFailed);
        const { userId } = TokenService.verifyAccessToken(token);
        const user = await UserService.findUserById(userId);
        req.user = user;
        return next();
    } catch (error) {
        next(error);
    }
}

function refreshToken(req, res, next) {
    try {
        const accessToken = req?.headers?.authorization?.split(" ")?.[1];
        const { userId } = jwt.decode(accessToken);
        const refreshToken = jwt.sign({ userId }, process.env.JWT_ACCESSTOKEN_SECRET, { expiresIn: "30d" })
        return res.json({
            accessToken,
            refreshToken,
        })

    } catch (error) {
        next(error);
    }
}

module.exports = {
    checkAccessToken,
    refreshToken,
};