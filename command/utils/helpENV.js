const autoBind = require('auto-bind');

module.exports = class HelpEnv {
    constructor() {
        autoBind(this);
        require('dotenv').config()
    }
}