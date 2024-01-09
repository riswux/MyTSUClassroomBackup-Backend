const { Direction } = require("../models/direction.model");
const { Faculty } = require("../models/faculty.model");

/* Create a direction */
async function createDirection(req, res, next) {
  const isFacultyExist = await Faculty.findById(req.body.facultyId);

  if (!isFacultyExist) {
    return res.status(404).json({
      error: true,
      message: "Faculty does not exist.",
    });
  }

  const isDirectionExists = await Direction.findOne({
    direction: req.body.directionName,
  });

  if (isDirectionExists) {
    return res.status(400).json({
      error: true,
      message: "Direction is already registered.",
    });
  }

  const newDirection = new Direction({
    direction: req.body.directionName,
    facultyId: req.body.facultyId,
  });

  try {
    await newDirection.save();

    return res.status(200).json({
      error: false,
      message: `Direction (${req.body.directionName}) is registered.`,
    });
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: err.message,
    });
  }
}

/* Update a direction */
async function updateDirection(req, res, next) {
  const isDirectionExists = await Direction.findById(req.body.directionId);

  if (!isDirectionExists) {
    return res.status(404).json({
      error: true,
      message: "Direction is not exist.",
    });
  }

  isDirectionExists.direction = req.body.directionName;
  isDirectionExists.facultyId = req.body.facultyId;

  try {
    await isDirectionExists.save();
    return res.status(200).json({
      error: false,
      message: "Direction has been updated successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: err.message,
    });
  }
}

/* Delete a direction */
async function deleteDirection(req, res, next) {
  const isDirectionExists = await Direction.findById(req.body.directionId);

  if (!isDirectionExists) {
    return res.status(404).json({
      error: true,
      message: "Direction is not exist.",
    });
  }

  const directionName = isDirectionExists.direction;

  try {
    await Direction.findByIdAndDelete({ _id: isDirectionExists._id });

    return res.status(200).json({
      error: false,
      message: `Direction (${directionName}) has been deleted successfully.`,
    });
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: err.message,
    });
  }
}

module.exports = {
  createDirection,
  updateDirection,
  deleteDirection,
};
