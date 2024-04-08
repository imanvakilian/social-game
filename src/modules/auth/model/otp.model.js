const { Schema, model, Types } = require("mongoose");


const otpSchema = new Schema({
    userId: Types.ObjectId,
    code: String,
    method: String,
    expiresIn: Date,
}, { timestamps: true });

const otpModel = model("otp", otpSchema);

module.exports = {
    otpModel,
};
