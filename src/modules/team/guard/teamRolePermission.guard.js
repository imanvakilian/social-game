const createHttpError = require("http-errors");
const { teamModel } = require("../model/team.model");
const { badRequestMessage } = require("../../../../command/messages/public.message");
const teamService = require("../team.service");

async function teamRolePermission(req, res, next) {
    try {
        const user = req.user;
        const { teamId } = req.params;
        const team = await teamService.findOne(teamId);
        if (team.leader == user._id.toString() || team.officers.includes(user._id)) return next();
        throw new createHttpError.BadRequest(badRequestMessage.teamPermission);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    teamRolePermission,
}