const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  votes: [
    {
      type: Map,
      of: Number,
      default: {},
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  optionSelected: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Poll", pollSchema);
