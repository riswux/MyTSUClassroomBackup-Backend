const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    disciplineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discipline",
      required: true,
    },
    season: {
      type: String,
      enum: ["Autumn", "Spring"],
      required: true,
    },
    method: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    building: {
      type: String,
      when: {
        method: "Offline",
      },
    },
    room: {
      type: String,
      when: {
        method: "Offline",
      },
    },
    dayOfWeek: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    finishTime: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = { Schedule };
