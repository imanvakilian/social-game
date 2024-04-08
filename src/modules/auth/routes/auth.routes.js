const authController = require('../auth.controller');
const { refreshToken, checkAccessToken } = require('../guard/accessToken.guard');

const authRouter = require('express').Router();

authRouter.post('/register', authController.register);
authRouter.post('/verification-register', authController.verificationRegister);
authRouter.get('/refreshToken', checkAccessToken, refreshToken);

module.exports = authRouter;