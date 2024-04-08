const createHttpError = require("http-errors");
const HelpEnv = require("../../../command/utils/helpENV");
const userModel = require("./model/user.model");
const { notFoundMessage } = require("../../../command/messages/public.message");
const { isValidObjectId } = require("mongoose");

class UserService extends HelpEnv {
    #userRepository = userModel;

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

    async findUserById(id) {
        if (!isValidObjectId(id)) throw new createHttpError.NotFound(notFoundMessage.userNotFound);
        const user = this.#userRepository.findById(id);
        if (!user) throw new createHttpError.NotFound(notFoundMessage.userNotFound);
        return user;
    }

    async findUserByUsername(username) {
        const user = this.#userRepository.findOne({ username });
        if (!user) throw new createHttpError.NotFound(notFoundMessage.userNotFound);
        return user;
    }

}

module.exports = new UserService();