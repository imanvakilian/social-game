const uploadFileTeam = require('../../../../config/multer.config');
const { maximumUserInTeam } = require('../guard/maximumUserInTeam.guard');
const { teamLeaderPermission } = require('../guard/teamLeaderPermission.guard');
const { teamRolePermission } = require('../guard/teamRolePermission.guard');
const teamController = require('../team.controller');

const teamRouter = require('express').Router();

teamRouter.post('/', uploadFileTeam.single("profile"), teamController.create);
teamRouter.get('/:teamId', teamController.fullViewOfTeam);
teamRouter.post('/:teamId', maximumUserInTeam, teamController.requestTojoinTeam);// request-join
teamRouter.get('/accept-join/:teamId', teamRolePermission, teamController.showReqsToJoinTeam);
teamRouter.patch('/accept-join/:teamId', maximumUserInTeam, teamRolePermission, teamController.acceptReqToJoinTeam);
teamRouter.post('/invite/:teamId', maximumUserInTeam, teamRolePermission, teamController.inviteUser);
teamRouter.patch('/accept-invite/:teamId', maximumUserInTeam, teamController.acceptInvite);
teamRouter.patch('/upto-offiser/:teamId', teamLeaderPermission, teamController.upToOffiser);
teamRouter.patch('/downto-member/:teamId', teamLeaderPermission, teamController.downToMember);
teamRouter.delete('/kick/:teamId', maximumUserInTeam, teamRolePermission, teamController.kickUser);
teamRouter.patch('/change-leader/:teamId', teamLeaderPermission, teamController.changeLeader);
teamRouter.delete('/leave/:teamId', maximumUserInTeam, teamController.leaveTeam);

module.exports = teamRouter;