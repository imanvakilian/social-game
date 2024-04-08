const Joi = require("joi");
const { authTypeEnum, authMethodEnum } = require("../enum/authRegister");
const createHttpError = require("http-errors");
const { badRequestMessage, authMessage } = require("../../../../command/messages/public.message");

const authUsernamePipe = Joi.object({
    username: Joi.custom(([username, method]) => {
        if (!username) throw new createHttpError.BadRequest(badRequestMessage.invalidUsername);
        switch (method) {
            case authMethodEnum.mobile: {
                const validUsernameMobile = /^(0)?9\d{9}$/;
                if (new RegExp(validUsernameMobile).test(username)) return username;
                throw new createHttpError.BadRequest(badRequestMessage.invalidUsername);
            };
            case authMethodEnum.email: {
                if (username && username.length >= 2 && username.length <= 100) return username;
                throw new createHttpError.BadRequest(badRequestMessage.invalidUsername);
            };
            case authMethodEnum.username: {
                if (username && username.length >= 2 && username.length <= 100) return username;
                throw new createHttpError.BadRequest(badRequestMessage.invalidUsername);
            }

            default:
                throw new createHttpError.BadRequest(badRequestMessage.invalidUsername);
        }
    })
});

const authMethodPipe = Joi.object({
    method: Joi.custom((method) => {
        if (method == authMethodEnum.mobile || method == authMethodEnum.email || method == authMethodEnum.username) return method;
        throw new createHttpError.BadRequest(badRequestMessage.invalidMethod);
    })
});

const authTypePipe = Joi.object({
    type: Joi.custom(type => {
        if (type == authTypeEnum.signin || type == authTypeEnum.signup) return type;
        throw new createHttpError.BadRequest(badRequestMessage.invalidType);
    })
});

const resolveRegisterPipe = Joi.object({
    code: Joi.custom(code => {
        if (typeof code == "string" && code.length == 5) return code;
        throw new createHttpError.BadRequest(authMessage.invalidOrExpiredCode);
    })
})

module.exports = {
    authUsernamePipe,
    authMethodPipe,
    authTypePipe,
    resolveRegisterPipe,
}