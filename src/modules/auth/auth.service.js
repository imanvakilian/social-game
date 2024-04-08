const createHttpError = require("http-errors");
const { randomInt } = require('crypto');
const HelpEnv = require("../../../command/utils/helpENV");
const { authMethodPipe, authTypePipe, authUsernamePipe, resolveRegisterPipe } = require("./pipe/auth.pipe");
const { returnValidationErrorMsg } = require("../../../command/utils/validation.errorhandler");
const { authTypeEnum, authMethodEnum } = require("./enum/authRegister");
const userModel = require("../user/model/user.model");
const { otpModel } = require("./model/otp.model");
const { notFoundMessage, badRequestMessage, conflictMessage, authMessage } = require("../../../command/messages/public.message");
const { generateOtp } = require("../../../command/utils/generate.util");
const TokenService = require("./token.service");
const UserService = require("../user/user.service");
const { default: axios } = require("axios");

class AuthService extends HelpEnv {
    #userRepository = userModel;
    #otpRepository = otpModel;
    #tokenService = TokenService;
    #userService = UserService;
    // ================================ start register =========================================================
    async register(registerDto, res, next) {
        try {
            const { method, type, username } = registerDto;
            this.validateDto(method, type, username);
            const result = type == authTypeEnum.signin ? await this.signin(username, method) : await this.signup(username, method);
            const { message, code, userId } = result;
            const token = this.#tokenService.createOtpToken({ userId }, next);
            res.cookie(process.env.OTP_COOKIE_NAME, token, { signed: true, maxAge: 1000 * 60 * 2 });
            return res.status(201).json({
                message,
                code
            })
        } catch (error) {
            next(error);
        }
    }

    async signin(username, method) {
        let user = await this.findUser(username, method);
        if (!user) throw new createHttpError.NotFound(notFoundMessage.userNotFound);
        if (method == authMethodEnum.email) user.verify_email = false;
        else user.verify_mobile = false;
        await user.save();
        const otp = await this.remakeOtp(user._id, method);
        const kavenegar = await this.reqToKavenagar(user.mobile, otp.code);
        return {
            // message: authMessage.otpSent,
            // code: otp.code,
            // userId: user._id,
            kavenegar
        }
    }

    async signup(username, method) {
        if (method == authMethodEnum.username) throw new createHttpError.BadRequest(badRequestMessage.invalidUsername);
        let user = await this.findUser(username, method);
        if (user) throw new createHttpError.Conflict(conflictMessage.conflictUsername);
        const query = method == authMethodEnum.mobile ? { mobile: username } : { email: username };
        user = await this.#userRepository.create(query);
        const createUsername = `u_${new Date(Date.now()).getTime()}${randomInt(1000, 9999)}`
        user.username = createUsername;
        const otp = await this.makeOtp(user._id, method);
        user.otp = otp._id;
        await user.save();
        const kavenegar = await this.reqToKavenagar(user.mobile, otp.code);
        return {
            // message: authMessage.otpSent,
            // code: otp.code,
            // userId: user._id,
            kavenegar
        }
    }
    // ================================ end register =========================================================
    // ================================ start check otp =========================================================
    async verificationRegister(resolveRegisterDto, req, res, next) {
        try {
            const { code } = resolveRegisterDto;
            const { userId } = this.checkExistNeededValues(code, req);
            const user = await this.#userService.findUserById(userId);
            const otp = await this.checkOtp(userId, code);
            if (otp.method == authMethodEnum.email) user.verify_email = true;
            else user.verify_mobile = true;
            await user.save();
            const accessToken = this.#tokenService.createAccessToken({ userId }, next);
            // res.cookie(ACCESSTOKEN_COOKIE_NAME, token, { sigend: true, maxAge: 1000 * 60 * 60 * 24 * 30 });
            return res.status(201).json({
                message: authMessage.logedIn,
                accessToken,
            })
        } catch (error) {
            next(error);
        }
    }
    // ================================ end check otp =========================================================
    // ================================ start help =========================================================
    validateDto(method, type, username) {
        const { value: methodValue, error: methodError } = authMethodPipe.validate({ method });
        if (methodError) throw new createHttpError.BadRequest(returnValidationErrorMsg(methodError));
        const { value: typeValue, error: typeError } = authTypePipe.validate({ type });
        if (typeError) throw new createHttpError.BadRequest(returnValidationErrorMsg(typeError));
        const { value: usernameValue, error: usernameError } = authUsernamePipe.validate({ username: [username, method] });
        if (usernameError) throw new createHttpError.BadRequest(returnValidationErrorMsg(usernameError));
    }

    async findUser(username, method) {
        let query = {};
        switch (method) {
            case authMethodEnum.mobile:
                query = { mobile: username };
                break;
            case authMethodEnum.email:
                query = { email: username };
                break;
            default:
                query = { username };
        };
        return this.#userRepository.findOne(query);
    }

    async reqToKavenagar(receptor, token) {
        const data = {
            receptor,
            token,
            template: "register",
            type: "sms",
        }
        const status = await axios.post(`https://api.kavenegar.com/v1/${process.env.API_KEY}/verify/lookup.json`, data);
        return status;
    }

    async makeOtp(userId, method) {
        const otpOptions = generateOtp(userId, method);
        const otp = await this.#otpRepository.create(otpOptions);
        return otp;
    }

    async remakeOtp(userId, method) {
        const otp = await this.#otpRepository.findOne({ userId });
        if (otp.expiresIn > new Date()) throw new createHttpError.BadRequest(badRequestMessage.badTiming);
        const otpOptions = generateOtp(userId, method);
        otp.code = otpOptions.code;
        otp.expiresIn = otpOptions.expiresIn;
        await otp.save();
        return otp;
    }

    checkExistNeededValues(code, req, next) {
        const { value: codePipeVal, error: codePipeErr } = resolveRegisterPipe.validate({ code });
        if (codePipeErr) throw new createHttpError.Unauthorized(returnValidationErrorMsg(codePipeErr));
        const token = req?.signedCookies?.[process.env.OTP_COOKIE_NAME];
        if (!token) throw new createHttpError.Unauthorized(authMessage.somethingWrong);
        const { userId } = this.#tokenService.verifyOtpToken(token, next);
        return {
            userId,
        };
    }

    async checkOtp(userId, code) {
        const otp = await this.#otpRepository.findOne({ userId });
        if (otp.expiresIn < new Date() || otp.code !== code) throw new createHttpError.Unauthorized(authMessage.invalidOrExpiredCode);
        return otp;
    }

    // ================================ end help =========================================================
}

module.exports = new AuthService();