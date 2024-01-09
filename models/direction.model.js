const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupCode: {
    type: String,
    required: false,
  },
});

const directionSchema = new mongoose.Schema(
  {
    direction: {
      type: String,
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    group: [groupSchema],
  },
  {
    versionKey: false,
  }
);

const Direction = mongoose.model("Direction", directionSchema);
module.exports = { Direction };
