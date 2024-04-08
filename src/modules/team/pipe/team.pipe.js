const Joi = require("joi");
const { statusForAcceptJoinReqEnum } = require("../enum/team.enum");

const createTeamPipe = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(1).max(200).allow(null),
});

const acceptReqToJoinTeamPipe = Joi.object({
    status: Joi.string().required().equal(statusForAcceptJoinReqEnum.accept, statusForAcceptJoinReqEnum.reject),
});

const inviteUserPipe = Joi.object({
    username: Joi.string().min(3).max(70).required(),
});

module.exports = {
    createTeamPipe,
    acceptReqToJoinTeamPipe,
    inviteUserPipe,
}