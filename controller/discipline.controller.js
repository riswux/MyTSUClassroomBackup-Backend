const { Discipline } = require("../models/discipline.model");
const { Schedule } = require("../models/schedule.model");
const { User } = require("../models/user.model");
const mongoose = require("mongoose");

// Create a new discipline
async function createDiscipline(req, res, next) {
  try {
    const teacherId = req.body.teacherId.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const groupId = req.body.groupId.map(
      (id) => new Number(id)
    );

    if (req.body.method === "Online") {
      req.body.building = null;
      req.body.room = null;
    } else {
      req.body.building = req.body.building;
      req.body.room = req.body.room;
    }

    const newDiscipline = new Discipline({
      discipline: req.body.disciplineName,
      description_plainContent: req.body.description_plainContent,
      description_htmlContent: req.body.description_htmlContent,
      year: req.body.year,
      grade: req.body.grade,
      readingAndLiterature_plainContent:
        req.body.readingAndLiterature_plainContent,
      readingAndLiterature_htmlContent:
        req.body.readingAndLiterature_htmlContent,
      groupId: groupId,
      teacherId: teacherId,
    });

    await newDiscipline.save();

    const newSchedule = new Schedule({
      disciplineId: newDiscipline._id,
      season: req.body.season,
      method: req.body.method,
      building: req.body.building,
      room: req.body.room,
      dayOfWeek: req.body.dayOfWeek,
      startTime: req.body.startTime,
      finishTime: req.body.finishTime,
    });

    await newSchedule.save();

    res.status(201).send({
      error: false,
      message: "Discipline has been saved successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      error: false,
      message: err.message,
    });
  }
}

// Read all disciplines and discipline by Group Id
async function getAllDiscipline(req, res, next) {
  try {
    const schedule = await Schedule.find();

    if (req.query.groupId !== undefined) {
      // Filter the discipline based on Group ID

      const id = req.query.groupId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          error: true,
          message: "Invalid ObjectId format",
        });
      }

      const discipline = await Discipline.find({
        groupId: new mongoose.Types.ObjectId(id),
      });

      if (discipline.length === 0) {
        return res.status(404).json({
          error: true,
          message: "There is no discipline found.",
        });
      }

      const webResponse = discipline.map((disciplineItem) => ({
        discipline: disciplineItem,
        schedule: schedule.filter(
          (scheduleItem) =>
            scheduleItem.disciplineId.toString() ===
            disciplineItem._id.toString()
        ),
      }));

      return res.status(200).json(webResponse);
    } else if (req.query.teacherId !== undefined) {
      // Filter the discipline based on Teacher ID

      const id = req.query.teacherId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          error: true,
          message: "Invalid ObjectId format",
        });
      }

      const user = await User.findById(id);

      if (user.role !== "Teacher") {
        return res.status(400).json({
          error: true,
          message: "User is not a teacher",
        });
      }

      const discipline = await Discipline.find({
        teacherId: new mongoose.Types.ObjectId(id),
      });

      if (discipline.length === 0) {
        return res.status(404).json({
          error: true,
          message: "There is no discipline found.",
        });
      }

      const webResponse = discipline.map((disciplineItem) => ({
        discipline: disciplineItem,
        schedule: schedule.filter(
          (scheduleItem) =>
            scheduleItem.disciplineId.toString() ===
            disciplineItem._id.toString()
        ),
      }));

      return res.status(200).json(webResponse);
    } else if (req.query.season !== undefined) {
      // Filter the discipline based on Season

      const season = req.query.season;

      try {
        const disciplines = await Discipline.find({
          _id: {
            $in: (
              await Schedule.find({
                season: { $regex: new RegExp(season, "i") },
              })
            ).map((s) => s.disciplineId),
          },
        });

        if (disciplines.length === 0) {
          return res.status(404).json({
            error: true,
            message: "No disciplines found for the specified season.",
          });
        }

        const webResponse = disciplines.map((disciplineItem) => ({
          discipline: disciplineItem,
          schedule: schedule.filter(
            (scheduleItem) =>
              scheduleItem.disciplineId.toString() ===
              disciplineItem._id.toString()
          ),
        }));

        return res.status(200).json(webResponse);
      } catch (error) {
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      }
    }

    const discipline = await Discipline.find();

    if (discipline.length === 0) {
      return res.status(404).json({
        error: true,
        message: "There is no discipline found.",
      });
    }

    const webResponse = discipline.map((disciplineItem) => ({
      discipline: disciplineItem,
      schedule: schedule.filter(
        (scheduleItem) =>
          scheduleItem.disciplineId.toString() == disciplineItem._id.toString()
      ),
    }));

    return res.status(200).json(webResponse);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message,
    });
  }
}

// Update a discipline
async function updateDiscipline(req, res, next) {
  const disciplineId = req.body.disciplineId;
  const isDisciplineExists = await Discipline.findById(disciplineId);

  if (!isDisciplineExists) {
    return res.status(404).send({
      error: true,
      message: "Discipline is not found.",
    });
  }

  try {
    const teacherId = req.body.teacherId.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const groupId = req.body.groupId.map(
      (id) => new Number(id)
    );

    const updatedDiscipline = {
      discipline: req.body.disciplineName,
      description_plainContent: req.body.description_plainContent,
      description_htmlContent: req.body.description_htmlContent,
      year: req.body.year,
      grade: req.body.grade,
      readingAndLiterature_plainContent:
      req.body.readingAndLiterature_plainContent,
      readingAndLiterature_htmlContent:
      req.body.readingAndLiterature_htmlContent,
      groupId: groupId,
      teacherId: teacherId,
    };

    await Discipline.findByIdAndUpdate(disciplineId, updatedDiscipline, {
      new: true,
    });

    return res.status(200).send({
      error: false,
      message: "Discipline has been updated successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      error: false,
      message: err.message,
    });
  }
}

// Update a schedule
async function updateSchedule(req, res, next) {
  const scheduleId = req.body.scheduleId;
  const isScheduleExists = await Schedule.findById(scheduleId);

  if (!isScheduleExists) {
    return res.status(404).send({
      error: true,
      message: "Schedule is not found.",
    });
  }

  try {
    if (req.body.method === "Online") {
      req.body.building = null;
      req.body.room = null;
    } else {
      req.body.building = req.body.building;
      req.body.room = req.body.room;
    }

    const updatedSchedule = {
      season: req.body.season,
      method: req.body.method,
      building: req.body.building,
      room: req.body.room,
      dayOfWeek: req.body.dayOfWeek,
      startTime: req.body.startTime,
      finishTime: req.body.finishTime,
    };

    await Schedule.findByIdAndUpdate(scheduleId, updatedSchedule, {
      new: true,
    });

    return res.status(200).send({
      error: false,
      message: "Schedule has been updated successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      error: false,
      message: err.message,
    });
  }
}

// Delete a schedule
async function deleteSchedule(req, res, next) {
  const scheduleId = req.body.scheduleId;
  const isScheduleExists = await Schedule.findById(scheduleId);

  if (!isScheduleExists) {
    return res.status(404).send({
      error: true,
      message: "Schedule is not found.",
    });
  }

  try {
    await Schedule.findByIdAndDelete(scheduleId);

    return res.status(200).send({
      error: false,
      message: "Schedule has been deleted successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      error: false,
      message: err.message,
    });
  }
}

// Delete a discipline
async function deleteDiscipline(req, res, next) {
  const disciplineId = req.body.disciplineId;
  const isDisciplineExists = await Discipline.findById(disciplineId);

  if (!isDisciplineExists) {
    return res.status(404).send({
      error: true,
      message: "Discipline is not found.",
    });
  }

  try {
    const isScheduleExists = await Schedule.find({
      disciplineId: new mongoose.Types.ObjectId(isDisciplineExists._id),
    });

    if (isScheduleExists.length > 0) {
      await Promise.all(
        isScheduleExists.map((schedule) =>
          Schedule.findByIdAndDelete(schedule._id)
        )
      );
    }

    await Discipline.findByIdAndDelete(disciplineId);

    return res.status(200).send({
      error: false,
      message: "Discipline has been deleted successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      error: false,
      message: err.message,
    });
  }
}

module.exports = {
  createDiscipline,
  getAllDiscipline,
  updateDiscipline,
  updateSchedule,
  deleteSchedule,
  deleteDiscipline,
};
