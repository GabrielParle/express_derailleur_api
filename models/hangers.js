const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HangerSchema = new Schema({
    name: String,
    bolts: Number,
    inside: Boolean,
    outside: Boolean,
    qr: Boolean,
    thruAxle: Boolean,
    image: String
})

const Hangers = mongoose.model("Hangers", HangerSchema);
module.exports = Hangers;