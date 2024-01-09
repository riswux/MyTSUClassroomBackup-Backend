const jwt = require("jsonwebtoken");
const constant = require("../middleware/constants");
const secret = constant.jwtSecret;
const { User } = require("../models/user.model");
const { Blacklist } = require("../models/blacklist.model");
const { Discipline } = require("../models/discipline.model");
const { ObjectId } = require('mongodb');

// Validate user credentials
async function validateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      error: true,
      message: "Access token is missing.",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, secret);

    if (!decodedToken) {
      return res.status(403).json({
        error: true,
        message: "Access token is invalid.",
      });
    }

    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User is not found.",
      });
    }

    const isBlacklistedToken = await Blacklist.find({ userId: userId });
    if (isBlacklistedToken) {
      return res.status(403).json({
        error: true,
        message: "Token is blacklisted. Please login again.",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Internal server error.",
    });
  }
}

// Validate teacher credentials
async function validateTeacherToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      error: true,
      message: "Access token is missing.",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const isBlacklistedToken = await Blacklist.findOne({ token: token });
    if (isBlacklistedToken) {
      return res.status(403).json({
        error: true,
        message: "Token is blacklisted. Please login again.",
      });
    }

    const decodedToken = jwt.decode(token, secret, {
      complete: true,
    });

    if (!decodedToken) {
      return res.status(403).json({
        error: true,
        message: "Access token is invalid.",
      });
    }

    const userId = decodedToken.sub;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Teacher user is not found in the access token.",
      });
    }

    if (user.role !== "Teacher") {
      return res.status(401).json({
        error: true,
        message: "Unauthorized access.",
      });
    }

    req.teacherUser = user;
    next();

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Internal server error.",
    });
  }
}

// Validate teacher's access to a discipline
async function teacherDiscipline(req, res, next) {
  try {
    const userId = req.teacherUser._id;
    const discipline = await Discipline.find({
      $and: [
        { _id: req.body.disciplineId },
        { teacherId: { $in: userId } }
      ]
    }).exec();
    
    if (discipline.length < 1) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized access.",
      });
    }

    next();

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Internal server error.",
    });
  }
}

// Validate admin credentials
async function validateAdminToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      error: true,
      message: "Access token is missing.",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const isBlacklistedToken = await Blacklist.findOne({ token: token });
    if (isBlacklistedToken) {
      return res.status(403).json({
        error: true,
        message: "Token is blacklisted. Please login again.",
      });
    }

    const decodedToken = jwt.decode(token, secret, {
      complete: true,
    });
    console.log(decodedToken);

    if (!decodedToken) {
      return res.status(403).json({
        error: true,
        message: "Access token is invalid.",
      });
    }

    const userId = decodedToken.sub;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Admin user is not found in the access token.",
      });
    }

    if (!user.isAdmin) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized access.",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Internal server error.",
    });
  }
}

// Generate access token
function generateAccessToken(userId, role, isAdmin, avatar) {
  return jwt.sign({ 
    sub: userId,
    role: role,
    admin: isAdmin,
    avatar: avatar, 
  }, secret, {
    expiresIn: "1800s",
    algorithm: "HS256",
  });
}

// Parse access token
function parseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const decodedToken = jwt.decode(token, secret, {
    complete: true,
  });

  return decodedToken;
}

module.exports = {
  validateToken,
  validateTeacherToken,
  teacherDiscipline,
  validateAdminToken,
  generateAccessToken,
  parseToken,
};
