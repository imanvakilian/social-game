const authMethodEnum = Object.freeze({
    mobile: "mobile",
    email: "email",
    username: "username",
})
const authTypeEnum = Object.freeze({
    signin: "signin",
    signup: "signup",
})

module.exports = {
    authMethodEnum,
    authTypeEnum,
}