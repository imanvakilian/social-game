const HelpEnv = require("../../../command/utils/helpENV")
const AuthService = require("./auth.service")

class AuthController extends HelpEnv {
    #authService = AuthService;

    register(req, res, next) {
        return this.#authService.register(req.body, res, next);
    }

    verificationRegister(req, res, next) {
        return this.#authService.verificationRegister(req.body, req, res, next);
    }

}

module.exports = new AuthController();