
// ============= start components =============
/**
 * @swagger
 *  components:
 *   schemas:
 *      createTeam:
 *           type: object
 *           required:
 *               -   name
 *           properties:
 *               name:
 *                  type: string
 *               description:
 *                  type: string
 *               profile:
 *                  format: binary
 *                  type: string
 *      inviteToTeam:
 *           type: object
 *           required:
 *               -   username
 *           properties:
 *               username:
 *                  type: string
 */
// ============= end components =============
// ============= start definitions =============
/**
 * @swagger
 *  definitions:
 *      createTeam:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: team ceated successfully
 *      reqToJoinTeam:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: request sent successfully
 *      acceptReqToJoinTeam:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: requst to join team (accepted || rejected)
 *      showReqToJoinTeam:
 *          type: object
 *          properties:
 *              requestToJoin:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: u_000000000000
 *                          nickname:
 *                              type: string
 *                              example: player
 *      fullViewOfTeam:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  example: name of team
 *              description:
 *                  type: string
 *                  example: description of team
 *              leader:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                          example: u_000000000000
 *                      nickname:
 *                          type: string
 *                          example: player
 *              offisers:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: u_000000000000
 *                          nickname:
 *                              type: string
 *                              example: player
 *              members:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: u_000000000000
 *                          nickname:
 *                              type: string
 *                              example: player
 *      inviteToTeam:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: request to join sent successfully
 *      acceptInviteToTeam:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: (joined to team successfully || resuest to join team rejected)
 *      upToOffiser:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: user level up to offiser the team
 *      downToMember:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: user level down to member the team
 *      kickUserFromTeam:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: user kicked
 *      changeLeader:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: user level up to leader of the team
 *      leaveTeam:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: you left team
 */
// ============= end definitions =============
// ============= start create =============
/**
 * @swagger
 *  /team:
 *      post:
 *          tags: [Team]
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: "#/components/schemas/createTeam"
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/createTeam"
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/createTeam"
 */
// ============= end create =============
// ============= start reqToJoinTeam =============
/**
 * @swagger
 *  /team/{teamId}:
 *      post:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/reqToJoinTeam"
 */
// ============= end reqToJoinTeam =============
// ============= start fullViewOfTeam =============
/**
 * @swagger
 *  /team/{teamId}:
 *      get:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/fullViewOfTeam"
 */
// ============= end fullViewOfTeam =============
// ============= start accept reqToJoinTeam =============
/**
 * @swagger
 *  /team/accept-join/{teamId}:
 *      patch:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  required: true
 *                  type: string
 *              -   in: query
 *                  name: requesterId
 *                  required: true
 *                  type: string
 *              -   in: query
 *                  required: true
 *                  name: status
 *                  enum:
 *                      -   accept
 *                      -   reject
 *                  type: string
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/acceptReqToJoinTeam"
 */
// ============= end accept reqToJoinTeam =============
// ============= start show reqToJoinTeam =============
/**
 * @swagger
 *  /team/accept-join/{teamId}:
 *      get:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/showReqToJoinTeam"
 */
// ============= end show reqToJoinTeam =============
// ============= start inviteToTeam =============
/**
 * @swagger
 *  /team/invite/{teamId}:
 *      post:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *              -   in: query
 *                  name: requesterId
 *                  type: string
 *                  required: true
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/inviteToTeam"
 */
// ============= end inviteToTeam =============
// ============= start accept inviteToTeam =============
/**
 * @swagger
 *  /team/accept-invite/{teamId}:
 *      patch:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *              -   in: query
 *                  name: status
 *                  type: string
 *                  required: true
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/acceptInviteToTeam"
 */
// ============= end accept inviteToTeam =============
// ============= start upToOffiser =============
/**
 * @swagger
 *  /team/upto-offiser/{teamId}:
 *      patch:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *              -   in: query
 *                  name: subjectId
 *                  type: string
 *                  required: true
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/upToOffiser"
 */
// ============= end upToOffiser =============
// ============= start down to member =============
/**
 * @swagger
 *  /team/kick/{teamId}:
 *      patch:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *              -   in: query
 *                  name: subjectId
 *                  type: string
 *                  required: true
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/downToMember"
 */
// ============= end  down to member =============
// ============= start kick from team =============
/**
 * @swagger
 *  /team/kick/{teamId}:
 *      delete:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *              -   in: query
 *                  name: subjectId
 *                  type: string
 *                  required: true
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/kickUserFromTeam"
 */
// ============= end kick from team =============
// ============= start change leader =============
/**
 * @swagger
 *  /team/change-leader/{teamId}:
 *      patch:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *              -   in: query
 *                  name: subjectId
 *                  type: string
 *                  required: true
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/changeLeader"
 */
// ============= end change leader =============
// ============= start left team =============
/**
 * @swagger
 *  /team/leave/{teamId}:
 *      delete:
 *          tags: [Team]
 *          parameters:
 *              -   in: path
 *                  name: teamId
 *                  type: string
 *                  required: true
 *              -   in: query
 *                  name: subjectId
 *                  type: string
 *                  required: true
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/leaveTeam"
 */
// ============= end left team =============


