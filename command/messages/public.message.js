const badRequestMessage = Object.freeze({
    invalidMethod: "invalid auth method",
    invalidType: "invalid auth type",
    invalidUsername: "invalid auth username",
    sizeImage: "size image must less than 3mb",
    badTiming: "code has not expired yet... please try 2 minutes after last request",
    tryAgain: "try again",
    intoTeam: "already in a team",
    // invitedBeforeReq: "this team has been invited you before... you can accept their invite in invite session",
    teamPermission: "you must be leader or offiser of team to doing this",
    leaderPermission: "you must be leader of team to doing this",
    processFailed: "process failed",
    offiserLength: "can not have more than 2 offisers in a team",
    reqToJoinLength: "request to join in this team is full",
    inviteLength: "invite to join in this team is full",
});
const conflictMessage = Object.freeze({
    conflictUsername: "someone else is useing this username infomation",
    conflictTeam: "this team is already exists",
});
const notFoundMessage = Object.freeze({
    userNotFound: "user not found",
    teamNotFound: "team not found",
});
const authMessage = Object.freeze({
    otpSent: "otp sent successfully",
    logedIn: "you loged in successfully",
    invalidOrExpiredCode: "code has expired or is invalid",
    somethingWrong: "something wrong",
    authFailed: "authorization failed",
});

const publicMessage = Object.freeze({
    created: "created successfully",
    cancleReqToJoinTeam: "request to join this team removed successfully",
    reqToJoinTeamSent: "request to join this team sent successfully",
    joinedTeam: "joined to this team successfully",
    acceptJoinReq: "req to join team accepted",
    rejectJoinReq: "request to join team rejected",
    inviteMsg: "team invited to join their team",
    capacityClose: "the capacity of team is full",
    upToOffiser: "level up to offiser of the team",
    downToMember: "down to member of the team",
    kick: "kicked",
    upToLeader: "level up to leader of the team",
    leftTeam: "left team"
})

module.exports = {
    badRequestMessage,
    conflictMessage,
    notFoundMessage,
    publicMessage,
    authMessage,
}