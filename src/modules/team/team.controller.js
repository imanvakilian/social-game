const HelpEnv = require("../../../command/utils/helpENV")
const TeamService = require("./team.service")

class TeamController extends HelpEnv {
    #teamService = TeamService;

    create(req, res, next) {
        return this.#teamService.create(req, res, next);
    }

    requestTojoinTeam(req, res, next) {
        return this.#teamService.requestTojoinTeam(req, res, next);
    }

    acceptReqToJoinTeam(req, res, next) {
        return this.#teamService.acceptReqToJoinTeam(req, res, next);
    }

    showReqsToJoinTeam(req, res, next) {
        return this.#teamService.showReqsToJoinTeam(req, res, next);
    }

    fullViewOfTeam(req, res, next) {
        return this.#teamService.fullViewOfTeam(req, res, next);
    }

    inviteUser(req, res, next) {
        return this.#teamService.inviteUser(req, res, next);
    }

    acceptInvite(req, res, next) {
        return this.#teamService.acceptInvite(req, res, next);
    }

    upToOffiser(req, res, next) {
        return this.#teamService.upToOffiser(req, res, next);
    }

    downToMember(req, res, next) {
        return this.#teamService.downToMember(req, res, next);
    }

    kickUser(req, res, next) {
        return this.#teamService.kickUser(req, res, next);
    }

    changeLeader(req, res, next) {
        return this.#teamService.changeLeader(req, res, next);
    }

    leaveTeam(req, res, next) {
        return this.#teamService.leaveTeam(req, res, next);
    }

    findAll() {

    }

    findOne() {

    }

    update() {

    }

    delete() {

    }

}

module.exports = new TeamController();