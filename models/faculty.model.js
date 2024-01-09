const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    faculty: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Faculty = mongoose.model("Faculty", facultySchema);
module.exports = { Faculty };
