const HelpEnv = require("../../../command/utils/helpENV")
const UserService = require("./user.service")

class UserController extends HelpEnv {
    #userService = UserService;

    create() {

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

module.exports = new UserController();