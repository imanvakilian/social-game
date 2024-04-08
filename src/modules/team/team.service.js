const createHttpError = require("http-errors");
const { deleteNullKeyInObject } = require("../../../command/utils/help.util");
const HelpEnv = require("../../../command/utils/helpENV");
const { createTeamPipe, acceptReqToJoinTeamPipe, inviteUserPipe } = require("./pipe/team.pipe");
const { badRequestMessage, conflictMessage, publicMessage, notFoundMessage } = require("../../../command/messages/public.message");
const { returnValidationErrorMsg } = require("../../../command/utils/validation.errorhandler");
const { teamModel } = require("./model/team.model");
const userService = require("../user/user.service");
const { statusForAcceptJoinReqEnum } = require("./enum/team.enum");
const { isValidObjectId } = require("mongoose");
const userModel = require("../user/model/user.model");

class TeamService extends HelpEnv {
    #teamRepository = teamModel;
    #userRepository = userModel;
    #userService = userService;
    // =========== start create =====================================================================
    async create(req, res, next) {
        try {
            const { name, description } = req.body;
            const user = req.user;
            const { value, error: createPipeErr } = createTeamPipe.validate({ name, description });
            if (createPipeErr) throw new createHttpError.BadRequest(returnValidationErrorMsg(createPipeErr));
            await this.checkExistTeamByName(name);
            const profile = req?.file?.path?.replace("\\\\", "/")?.slice(7);
            await this.#teamRepository.create({ name, description, profile, creator: user._id, leader: user._id });
            user.into_team = true;
            await user.save();
            return res.status(201).json({
                message: publicMessage.created,
            })
        } catch (error) {
            next(error);
        }
    }
    // =========== end create =====================================================================
    // =========== start request to join =====================================================================
    async requestTojoinTeam(req, res, next) {
        try {
            const user = req.user;
            const { teamId } = req.params;
            const team = await this.findOne(teamId);
            if (user.into_team) throw new createHttpError.BadRequest(badRequestMessage.intoTeam);
            const { message } = await this.validateJoinReq(team, user);
            return res.status(201).json({
                message
            })
        } catch (error) {
            next(error);
        }
    }
    async validateJoinReq(team, user) {
        if (user.into_team) throw new createHttpError.BadRequest(badRequestMessage.intoTeam);
        let message;
        if (team.inviteUser.includes(user._id)) {
            team.members.push(user._id);
            message = publicMessage.joinedTeam;
        } else if (team.requestToJoin.includes(user._id)) {
            team.requestToJoin.pull(user._id);
            message = publicMessage.cancleReqToJoinTeam;
        } else {
            team.requestToJoin.push(user._id);
            message = publicMessage.reqToJoinTeamSent;
        }
        await team.save();
        return {
            message
        };
    }
    // =========== end request to join =====================================================================
    // =========== start show team =====================================================================
    async fullViewOfTeam(req, res, next) {
        try {
            const { teamId } = req.params;
            const team = await this.findOne(teamId);
            const match = { $match: { _id: team._id } };
            const leaderLookup = {
                $lookup: {
                    from: "users",
                    localField: "leader",
                    foreignField: "_id",
                    as: "leader"
                }
            };
            const offisersLookup = {
                $lookup: {
                    from: "users",
                    localField: "offisers",
                    foreignField: "_id",
                    as: "offisers"
                }
            };
            const membersLookup = {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "members"
                }
            };
            const unwind = { $unwind: "$leader" };
            const project = {
                $project: {
                    _id: 0,
                    name: 1,
                    description: 1,
                    leader: {
                        username: 1,
                        nickname: 1,
                    },
                    offisers: {
                        username: 1,
                        nickname: 1,
                    },
                    members: {
                        username: 1,
                        nickname: 1,
                    },
                }
            }
            const fullViewOfTeam = await this.#teamRepository.aggregate([
                match,
                leaderLookup,
                offisersLookup,
                membersLookup,
                unwind,
                project,
            ])

            return res.json({
                fullViewOfTeam: fullViewOfTeam[0]
            })

        } catch (error) {
            next(error);
        }
    }
    // =========== end show team =====================================================================
    // =========== start accept req to join =====================================================================
    async acceptReqToJoinTeam(req, res, next) {
        try {
            const { teamId } = req.params;
            const team = await this.findOne(teamId);
            const { requesterId, status } = req.query;
            const { value: statusVal, error: statusErr } = acceptReqToJoinTeamPipe.validate({ status });
            if (statusErr) throw new createHttpError.BadRequest(returnValidationErrorMsg(statusErr));
            const { message } = await this.validateAcceptJoinReq(status, team, requesterId);
            return res.status(201).json({
                message
            });
        } catch (error) {
            next(error);
        }
    }
    async validateAcceptJoinReq(status, team, requesterId) {
        let message;
        if (status == statusForAcceptJoinReqEnum.reject) {
            team.requestToJoin.pull(requesterId);
            message = publicMessage.rejectJoinReq;
        } else {
            const checkExistRequester = await this.#userService.findUserById(requesterId);
            if (checkExistRequester.into_team) throw new createHttpError.BadRequest(badRequestMessage.intoTeam);
            if (team.requestToJoin.includes(checkExistRequester._id) == false) throw new createHttpError.BadRequest(badRequestMessage.processFailed)
            team.requestToJoin.pull(checkExistRequester._id);
            team.members.push(checkExistRequester._id);
            checkExistRequester.into_team = true;
            message = publicMessage.acceptJoinReq;
            checkExistRequester.notification.push(`${message} from ${team.name}`);
            await checkExistRequester.save();
        }
        await team.save();
        return {
            message
        }
    }
    // =========== end accept req to join =====================================================================
    // =========== start show req to join =====================================================================
    async showReqsToJoinTeam(req, res, next) {
        try {
            const { teamId } = req.params;
            const team = await this.findOne(teamId);
            const match = {
                $match: {
                    _id: team._id
                }
            };
            const lookup = {
                $lookup: {
                    from: "users",
                    localField: "requestToJoin",
                    foreignField: "_id",
                    as: "requestToJoin"
                }
            };
            const project = {
                $project: {
                    _id: 0,
                    "requestToJoin": {
                        username: 1,
                        nickname: 1,
                    },
                }
            };
            const requestToJoin = await this.#teamRepository.aggregate([
                match,
                lookup,
                project,
            ]);
            return res.json({
                requestToJoin: requestToJoin[0].requestToJoin,
            })
        } catch (error) {
            next(error);
        }
    }
    // =========== end show req to join =====================================================================
    // =========== start invite user =====================================================================
    async inviteUser(req, res, next) {
        try {
            const { teamId } = req.params;
            const { requesterId } = req.query;
            if (!isValidObjectId(requesterId)) throw new createHttpError.NotFound(notFoundMessage.userNotFound);
            const team = await this.findOne(teamId);
            let invitedUser = await this.#userRepository.findById(requesterId);
            let message;
            const inviteNotifMsg = { message: `${team.name} ${publicMessage.inviteMsg}` };
            if (team.inviteUser.includes(requesterId)) {
                team.inviteUser.pull(requesterId);
                if (invitedUser) {
                    invitedUser.notification.pull(inviteNotifMsg);
                    await invitedUser.save();
                }
                await team.save();
                message = publicMessage.cancleReqToJoinTeam;
                return res.status(201).json({
                    message,
                })
            }
            invitedUser = await userService.findUserById(requesterId);
            if (invitedUser.into_team) throw new createHttpError.BadRequest(badRequestMessage.intoTeam);
            if (team.requestToJoin.includes(invitedUser._id)) {
                team.requestToJoin.pull(invitedUser._id);
                team.members.push(invitedUser._id);
                invitedUser.into_team = true;
                invitedUser.notification.push({ message: `${publicMessage.acceptJoinReq} from ${team.name}` });
                message = publicMessage.joinedTeam;
            } else {
                team.inviteUser.push(invitedUser._id);
                invitedUser.notification.push(inviteNotifMsg);
                message = publicMessage.reqToJoinTeamSent;
            };
            await team.save();
            await invitedUser.save();
            return res.status(201).json({
                message,
            })
        } catch (error) {
            next(error);
        }
    }
    // =========== end invite user =====================================================================
    // =========== start accept invite user =====================================================================
    async acceptInvite(req, res, next) {
        try {
            const user = req.user;
            const { teamId } = req.params;
            const { status } = req.query;
            const { value, error } = acceptReqToJoinTeamPipe.validate({ status });
            if (error) throw new createHttpError.BadRequest(returnValidationErrorMsg(error));
            const team = await this.findOne(teamId);
            if (!team.inviteUser.includes(user._id)) throw new createHttpError.BadRequest(badRequestMessage.processFailed);
            if (user.into_team) throw new createHttpError.BadRequest(badRequestMessage.intoTeam);
            team.inviteUser.pull(user._id);
            let message;
            if (status == statusForAcceptJoinReqEnum.accept) {
                team.members.push(user._id);
                user.into_team = true;
                message = publicMessage.joinedTeam;
            } else {
                message = publicMessage.rejectJoinReq;
            }
            await team.save();
            await user.save();
            return res.status(201).json({
                message,
            })
        } catch (error) {
            next(error);
        }
    }
    // =========== end accept invite user =====================================================================
    // =========== start upToOffiser =====================================================================
    async upToOffiser(req, res, next) {
        try {
            const { teamId } = req.params;
            const { subjectId } = req.query;
            const team = await this.findOne(teamId);
            const subject = await this.#userService.findUserById(subjectId);
            if (team.officers.length >= 2) throw new createHttpError.BadRequest(badRequestMessage.offiserLength);
            if (team.members.includes(subject._id)) {
                const notifMsg = `you ${publicMessage.upToOffiser}`;
                const message = `${subject.username} ${publicMessage.upToOffiser}`;
                team.members.pull(subject._id);
                team.officers.push(subject._id);
                subject.notification.push({ message: notifMsg });
                await subject.save();
                await team.save();
                return res.status(201).json({
                    message,
                })
            }
            throw new createHttpError.BadRequest(badRequestMessage.processFailed);
        } catch (error) {
            next(error);
        }
    }
    // =========== end upToOffiser =====================================================================
    // =========== start down to member =====================================================================
    async downToMember(req, res, next) {
        try {
            const { teamId } = req.params;
            const { subjectId } = req.query;
            const team = await this.findOne(teamId);
            const subject = await this.#userService.findUserById(subjectId);
            if (team.officers.includes(subject._id)) {
                team.officers.pull(subject._id);
                team.members.push(subject._id);
                subject.notification.push({ message: `you ${publicMessage.downToMember}` });
                await team.save();
                await subject.save();
                const message = `${subject.username} ${publicMessage.downToMember}`;
                return res.status(201).json({
                    message,
                })
            }
            throw new createHttpError.BadRequest(badRequestMessage.processFailed);
        } catch (error) {
            next(error);
        }
    }
    // =========== end down to member =====================================================================
    // =========== start kick user of team =====================================================================
    async kickUser(req, res, next) {
        try {
            const user = req.user;
            const { teamId } = req.params;
            const { subjectId } = req.query;
            const team = await this.findOne(teamId);
            const subject = await this.#userService.findUserById(subjectId)
            if (team.leader == user._id.toString()) {
                if (team.members.includes(subject._id)) {
                    team.members.pull(subject._id);
                } else if (team.officers.includes(subject._id)) {
                    team.officers.pull(subject._id);
                } else {
                    throw new createHttpError.BadRequest(badRequestMessage.processFailed);
                }
            } else {
                if (team.members.includes(subject._id)) {
                    team.members.pull(subject._id);
                } else {
                    throw new createHttpError.BadRequest(badRequestMessage.processFailed);
                }
            };
            subject.notification.push({ message: `you ${publicMessage.kick} from ${team.name}` });
            subject.into_team = false;
            await team.save();
            await subject.save();
            const message = `${subject.username} ${publicMessage.kick}`;
            return res.status(201).json({
                message,
            })
        } catch (error) {
            next(error);
        }
    }
    // =========== end kick user of team =====================================================================
    // =========== start change leader =====================================================================
    async changeLeader(req, res, next) {
        try {
            const user = req.user;
            const { teamId } = req.params;
            const { subjectId } = req.query;
            const team = await this.findOne(teamId);
            const subject = await this.#userService.findUserById(subjectId);
            if (team.officers.includes(subject._id)) {
                team.officers.pull(subject._id);
                team.leader = subject._id;
                team.officers.push(user._id);
                subject.notification.push({ message: `you ${publicMessage.upToLeader}` });
            } else if (team.members.includes(subject._id)) {
                team.members.pull(subject._id);
                team.leader = subject._id;
                team.members.push(user._id);
                subject.notification.push({ message: `you ${publicMessage.upToLeader}` });

            } else {
                throw new createHttpError.BadRequest(badRequestMessage.processFailed);
            }
            await team.save();
            await subject.save();
            const message = `${subject.username} ${publicMessage.upToLeader}`;
            return res.status(201).json({
                message,
            })

        } catch (error) {
            next(error);
        }
    }
    // =========== end change leader =====================================================================
    // =========== start leave team =====================================================================
    async leaveTeam(req, res, next) {
        try {
            const user = req.user;
            const { teamId } = req.params;
            const team = await this.findOne(teamId);
            if (team.leader == user._id.toString()) throw new createHttpError.BadRequest(badRequestMessage.processFailed);
            if (team.officers.includes(user._id)) team.officers.pull(user._id);
            else if (team.members.includes(user._id)) team.members.pull(user._id);
            else throw new createHttpError.BadRequest(badRequestMessage.processFailed);
            user.into_team = false;
            await user.save();
            await team.save();
            const message = `you ${publicMessage.leftTeam}`;
            return res.status(201).json({
                message,
            });

        } catch (error) {
            next(error);
        }
    }
    // =========== end leave team =====================================================================
    // =========== start help =====================================================================
    findAll() {

    }

    async findOne(_id) {
        if (!isValidObjectId(_id)) throw new createHttpError.NotFound(notFoundMessage.teamNotFound);
        const team = await this.#teamRepository.findOne({ _id });
        if (!team) throw new createHttpError.NotFound(notFoundMessage.teamNotFound);
        return team;
    }

    update() {

    }

    delete() {

    }

    async checkExistTeamByName(name) {
        const team = await this.#teamRepository.findOne({ name });
        if (team) throw new createHttpError.Conflict(conflictMessage.conflictTeam);
        return team;
    }
    // =========== enf help =====================================================================
}

module.exports = new TeamService();