const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  votes: { type: Map, of: String, default: {} }, // A map to store poll_id and the voted option
});

module.exports = mongoose.model("User", userSchema);
