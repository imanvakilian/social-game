
// ============= start components =============
/**
 * @swagger
 *  components:
 *   schemas:
 *      register:
 *           type: object
 *           required:
 *               -   username
 *               -   method
 *               -   type
 *           properties:
 *               username:
 *                  type: string
 *               method:
 *                  enum: 
 *                      -   mobile
 *                  type: string
 *               type:
 *                  enum: 
 *                      -   signin
 *                      -   signup
 *                  type: string
 *      verificationRegister:
 *           type: object
 *           required:
 *               -   code
 *           properties:
 *               code:
 *                  type: string
 */
// ============= end components =============
// ============= start definitions =============
/**
 * @swagger
 *  definitions:
 *      register:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: otp sent successfully
 *              code:
 *                  type: string
 *                  example: 12345
 *      verificationRegister:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: you loged in successfully
 *              accessToken:
 *                  type: string
 *                  example: accessToken...
 *      refreshToken:
 *          type: object
 *          properties:
 *              accessToken:
 *                  type: string
 *                  example: accessToken...
 *              refreshToken:
 *                  type: string
 *                  example: refreshToken...
 */
// ============= end definitions =============
// ============= start register =============
/**
 * @swagger
 *  /auth/register:
 *      post:
 *          tags: [Auth]
 *          requestBody:
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/register"
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/register"
 */
// ============= end register =============
// ============= start verificationRegister =============
/**
 * @swagger
 *  /auth/verification-register:
 *      post:
 *          tags: [Auth]
 *          requestBody:
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/verificationRegister"
 *          responses:
 *              201:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/verificationRegister"
 */
// ============= end verificationRegister =============
// ============= start refreshToken =============
/**
 * @swagger
 *  /auth/refreshToken:
 *      get:
 *          tags: [Auth]
 *          responses:
 *              200:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/definitions/refreshToken"
 */
// ============= end refreshToken =============

