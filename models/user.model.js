const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student", "Teacher"],
      required: true,
    },
    faculty: {
      type: String,
      when: {
        role: "Student",
      },
    },
    direction: {
      type: String,
      when: {
        role: "Student",
      },
    },
    group: {
      type: Number,
      when: {
        role: "Student",
      },
    },
    grade: {
      type: Number,
      when: {
        role: "Student",
      },
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isAdminVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
