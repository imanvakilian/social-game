const { Schema, Types, model } = require("mongoose");
const { roleEnum, roleEnumObj } = require("../enum/role.enum");


const notificationSchema = new Schema({
    message: String,
}, { timestamps: true });

const userSchema = new Schema({
    username: String,
    mobile: String,
    email: String,
    nickname: { type: String, default: "user" },
    otp: { type: Types.ObjectId, ref: "otp" },
    password: String,
    verify_mobile: { type: Boolean, default: false },
    verify_email: { type: Boolean, default: false },
    into_team: { type: Boolean, default: false },
    profile: String,
    role: { type: String, enum: roleEnum, default: roleEnumObj.user },
    teamInvite: { type: [Types.ObjectId], ref: "team" },
    notification: [notificationSchema],
}, { timestamps: true });

const userModel = model("user", userSchema);

module.exports = userModel;