const express = require("express");
const router = express.Router();
const { teacherDiscipline, validateTeacherToken } = require("../helper/jwt.helper");
const multer = require("multer");
const upload = multer();

const {updateDiscipline} = require("../controller/discipline.controller");

// Update a discipline
router.put("/discipline", validateTeacherToken, teacherDiscipline, upload.none(), updateDiscipline);

module.exports = router;
