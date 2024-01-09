const multer = require("multer");
const path = require("path");

const FILE_TYPES = {
  "image/jpeg": "jpeg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const avatarConfig = multer.diskStorage({
  destination: function (req, file, callback) {
    const isValidAvatar = FILE_TYPES[file.mimetype];
    let errorMessage = isValidAvatar ? null : new Error("Invalid file type.");

    callback(errorMessage, "uploads/avatar");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      `Avatar_Profile_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

module.exports = avatarConfig;
