const createHttpError = require("http-errors");
const teamService = require("../team.service");
const { badRequestMessage } = require("../../../../command/messages/public.message");

async function teamLeaderPermission(req, res, next) {
    try {
        const user = req.user;
        const { teamId } = req.params;
        const team = await teamService.findOne(teamId);
        if (team.leader == user._id.toString()) return next();
        throw new createHttpError.BadRequest(badRequestMessage.leaderPermission);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    teamLeaderPermission,
}