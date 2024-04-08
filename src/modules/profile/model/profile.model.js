const { Schema, Types, model } = require("mongoose");

const profileSchema = new Schema({
    userId: { type: Types.ObjectId, required: true },
    nickname: { type: String, default: "player" },
    bio: String,
    profile: String,
    game_tags: [String],
    team: String,
}, { timestamps: true });

const profileModel = model("profile", profileSchema);

module.exports = profileModel;