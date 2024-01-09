const mongoose = require("mongoose");

const disciplineSchema = new mongoose.Schema(
  {
    discipline: {
      type: String,
      required: true,
    },
    description_plainContent: {
      type: String,
      required: true,
    },
    description_htmlContent: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    readingAndLiterature_plainContent: {
      type: String,
      required: true,
    },
    readingAndLiterature_htmlContent: {
      type: String,
      required: true,
    },
    groupId: [
      {
        type: Number,
        required: true,
      }
    ],
    teacherId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    versionKey: false,
  }
);

const Discipline = mongoose.model("Discipline", disciplineSchema);
module.exports = { Discipline };
