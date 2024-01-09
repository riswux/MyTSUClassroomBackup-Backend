const { Faculty } = require("../models/faculty.model");

/* Create a faculty */
async function createFaculty(req, res, next) {
  const isFacultyExist = await Faculty.findOne({
    faculty: req.body.facultyName,
  });

  if (isFacultyExist) {
    return res.status(400).json({
      error: true,
      message: "Faculty is already registered.",
    });
  }

  const newFaculty = new Faculty({
    faculty: req.body.facultyName,
  });

  try {
    await newFaculty.save();

    return res.status(200).json({
      error: false,
      message: `Faculty (${req.body.facultyName}) is registered.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "An error occurred while processing your request.",
    });
  }
}

/* Update a faculty */
async function updateFaculty(req, res, next) {
  const isFacultyExist = await Faculty.findById(req.body.facultyId);

  if (!isFacultyExist) {
    return res.status(404).json({
      error: true,
      message: "Faculty is not exist.",
    });
  }

  isFacultyExist.faculty = req.body.facultyName;

  try {
    await isFacultyExist.save();
    return res.status(200).json({
      error: false,
      message: "Faculty has been updated successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "An error occurred while saving the faculty.",
    });
  }
}

/* Delete a faculty */
async function deleteFaculty(req, res, next) {
  const isFacultyExist = await Faculty.findById(req.body.facultyId);

  if (!isFacultyExist) {
    return res.status(404).json({
      error: true,
      message: "Faculty is not exist.",
    });
  }

  const facultyName = isFacultyExist.faculty;

  try {
    await Faculty.findByIdAndDelete({ _id: isFacultyExist._id });

    return res.status(200).json({
      error: false,
      message: `Faculty (${facultyName}) has been deleted successfully.`,
    });
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: err.message,
    });
  }
}

module.exports = {
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
