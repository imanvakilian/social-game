const { checkAccessToken } = require('../../modules/auth/guard/accessToken.guard');
const authRouter = require('../../modules/auth/routes/auth.routes');
const teamRouter = require('../../modules/team/routes/team.routes');

const mainRouter = require('express').Router();

mainRouter.get('/', (req, res) => {
    return res.send('hello');
});

mainRouter.use('/auth', authRouter);
mainRouter.use('/team', checkAccessToken, teamRouter);

module.exports = mainRouter;