const { Direction } = require("../models/direction.model");

// Get all group
async function getGroup(req, res) {
  try {

    const direction = await Direction.find();

    if (!direction) {
      return res.status(404).json({
        error: true,
        message: err.message,
      });
    }

    return res.status(200).json(direction);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "An error occurred while processing your request.",
    });
  }
}

/* Create a group */
async function createGroup(req, res, next) {
  const direction = await Direction.findById(req.body.directionId);

  if (!direction) {
    return res.status(400).json({
      error: true,
      message: "Direction does not exist.",
    });
  }

  const newGroup = {
    groupCode: req.body.groupCode,
  };

  try {
    direction.group.push(newGroup);

    await direction.save();

    return res.status(200).json({
      error: false,
      message: `Group (${req.body.groupCode}) is registered.`,
    });
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: err.message,
    });
  }
}

/* Update a group*/
async function updateGroup(req, res, next) {
  const direction = await Direction.findById(req.body.directionId);

  if (!direction) {
    return res.status(404).json({
      error: true,
      message: "Direction does not exist.",
    });
  }

  const directionId = req.body.directionId;
  const groupCodeBefore = req.body.groupCodeBefore;
  const groupCodeAfter = req.body.groupCodeAfter;

  try {
    const updatedGroup = await Direction.findOneAndUpdate(
      { _id: directionId, "group.groupCode": groupCodeBefore },
      { $set: { "group.$.groupCode": groupCodeAfter } },
      { new: true }
    );

    if (updatedGroup) {
      return res.status(200).json({
        error: false,
        message: `Group code has been updated successfully.`,
      });
    } else {
      return res.status(404).json({
        error: true,
        message: "No matching document found to update.",
      });
    }
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: err.message,
    });
  }
}

/* Delete a group */
async function deleteGroup(req, res, next) {
  const direction = await Direction.findById(req.body.directionId);

  if (!direction) {
    return res.status(404).json({
      error: true,
      message: "Direction is not exist.",
    });
  }

  const groupCode = req.body.groupCode;

  try {
    const deletedGroup = direction.group.filter(
      (group) => group.groupCode !== groupCode
    );

    direction.group = deletedGroup;

    const updatedDirection = await direction.save();

    if (updatedDirection) {
      return res.status(200).json({
        error: false,
        message: `Group code (${groupCode}) has been deleted successfully.`,
      });
    } else {
      return res.status(404).json({
        error: true,
        message: "No matching document found to update.",
      });
    }
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: err.message,
    });
  }
}

module.exports = {
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
};
