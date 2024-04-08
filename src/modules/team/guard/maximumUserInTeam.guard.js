const createHttpError = require("http-errors");
const { publicMessage, badRequestMessage } = require("../../../../command/messages/public.message");
const teamService = require("../team.service");

async function maximumUserInTeam(req, res, next) {
    try {
        const { teamId } = req.params;
        const team = await teamService.findOne(teamId);
        if(team.requestToJoin.length >= 50) throw new createHttpError.BadRequest(badRequestMessage.reqToJoinLength);
        if(team.inviteUser.length >= 50) throw new createHttpError.BadRequest(badRequestMessage.inviteLength);
        const leaderLength = 1;
        const offisersLength = team.officers.length;
        const membersLength = team.members.length;
        const finalLength = leaderLength + offisersLength + membersLength;
        if (offisersLength > 2) throw new createHttpError.BadRequest(badRequestMessage.processFailed);
        if (finalLength >= 50) {
            team.openCapacity = false;
            await team.save();
            throw new createHttpError.BadRequest(publicMessage.capacityClose);
        }
        team.openCapacity = true;
        await team.save();
        return next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    maximumUserInTeam,
}