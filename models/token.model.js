const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    usage: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Number,
      required: true,
      default: () => Date.now() + 1800 * 1000, // 30 minutes
    },
  },
  {
    versionKey: false,
  }
);

const Token = mongoose.model("Token", tokenSchema);
module.exports = { Token };
