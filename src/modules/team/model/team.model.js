const { Schema, Types, model } = require("mongoose");

const teamSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    members: { type: [Types.ObjectId], ref: "user", maxLength: 49 }, // min => 0 max => 47 | 49
    officers: { type: [Types.ObjectId], ref: "user", maxLength: 2 }, // min => 0 max => 2
    leader: { type: Types.ObjectId, required: true, ref: "user" }, // min and max => 1
    creator: { type: Types.ObjectId, required: true, ref: "user" },
    profile: String,
    inTournament: { type: Boolean, default: false },
    openCapacity: { type: Boolean, default: true },
    requestToJoin: { type: [Types.ObjectId], ref: "user" },
    inviteUser: { type: [Types.ObjectId], ref: "user" },
}, { timestamps: true });

const teamModel = model("team", teamSchema);

module.exports = {
    teamModel,
}