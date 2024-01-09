const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Blacklist = mongoose.model("Blacklist", blacklistedTokenSchema);
module.exports = { Blacklist };
