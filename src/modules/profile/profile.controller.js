const HelpEnv = require("../../../command/utils/helpENV")
const ProfileService = require("./user.service")

class ProfileController extends HelpEnv {
    #profileService = ProfileService;

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

module.exports = new ProfileController();