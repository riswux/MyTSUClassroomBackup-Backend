const passwordGenerator = require("generate-password");
const { Token } = require("../models/token.model");
const emailHelper = require("../helper/email.helper");
const crypto = require("crypto");
const { User } = require("../models/user.model");
const { Blacklist } = require("../models/blacklist.model");
const constant = require("../middleware/constants");
const secret = constant.jwtSecret;
const mongoose = require("mongoose");
const { generateAccessToken, parseToken } = require("../helper/jwt.helper");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const isEmailRegistered = await User.findOne({ email: req.body.email });

    if (isEmailRegistered) {
      return res.status(400).json({
        error: true,
        message: "Email is already registered.",
      });
    }

    const avatarPath = `${constant.hostUrl}/uploads/avatar/${req.file.filename}`;

    var generatedPassword = passwordGenerator.generate({
      length: 16,
      numbers: true,
    });

    const user = new User({
      name: req.body.name,
      birthDate: req.body.birthDate,
      email: req.body.email,
      phone: req.body.phone,
      avatar: avatarPath,
      role: req.body.role,
      faculty: req.body.faculty,
      direction: req.body.direction,
      group: req.body.group,
      grade: req.body.grade,
      password: generatedPassword,
      isAdmin: req.body.isAdmin || false,
      isAdminVerified: req.body.isAdminVerified || false,
    });

    await user.save();

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(20).toString("hex"), // random hex string for token
      usage: "Email Verification",
    });

    await token.save();

    console.log("Sending email...");
    emailHelper.sendVerificationEmail(req, token.token);

    return res.status(201).json({
      error: false,
      message: "User data has been saved.",
    });
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: err.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email: email });
    if (!user || user.password !== req.body.password) {
      return res.status(403).json({
        error: true,
        message: "Password is incorrect",
      });
    }

    const token = generateAccessToken(
        user._id,
        user.role,
        user.isAdmin,
        user.avatar
    );

    return res.status(200).json({ token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}

async function getUser(req, res) {
  try {
    // Get user based on ID
    if (req.query.userId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(req.query.userId)) {
        return res.status(400).json({
          error: true,
          message: "Invalid ObjectId format",
        });
      }

      const user = await User.findById(req.query.userId).select(
        "-isAdmin -isEmailVerified -password"
      );

      if (user.length === 0) {
        return res.status(404).json({
          error: true,
          message: "There is no user found.",
        });
      }

      return res.status(200).json(user);
    }

    // Get user based on teacher role
    if (req.query.role !== undefined) {
      const role = req.query.role.toLowerCase();

      const user = await User.find({
        role: { $regex: new RegExp(req.query.role, "i") },
      }).select(
        "-isAdmin -isEmailVerified -password -birthDate"
      );

      if (user.length === 0) {
        return res.status(404).json({
          error: true,
          message: "There is no user found.",
        });
      }

      return res.status(200).json(user);
    }

    // Get user waiting for acc
    if (req.query.isAdminVerified !== undefined) {
      const user = await User.find({
        isAdminVerified: false,
      }).select(
        "-isAdmin -isEmailVerified -password -birthDate"
      );

      if (user.length === 0) {
        return res.status(404).json({
          error: true,
          message: "There is no user found.",
        });
      }

      return res.status(200).json(user);
    }

    const user = await User.find().select(
      "-isAdmin -isEmailVerified -password -birthDate -avatar"
    );

    if (!user) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "An error occurred while processing your request.",
    });
  }
}

async function changePassword(req, res) {
  try {
    const tokenParsed = parseToken(req, res);
    const userId = tokenParsed.sub;
    const newPass = req.body.newPassword;
    const confirmPass = req.body.confirmPassword;

    if (newPass === confirmPass) {
      // Update the user's password
      const updatedPassword = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { password: newPass } },
        { new: true }
      );

      if (updatedPassword) {
        return res.status(200).json({
          error: false,
          message: "Password has been updated successfully",
        });
      } else {
        return res.status(404).json({
          error: true,
          message: "User is not found",
        });
      }
      
    } else {
      return res.status(400).json({
        error: true,
        message: "The new password and password confirmation do not match.",
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}

async function editProfile(req, res) {
  try {
    const tokenParsed = parseToken(req, res);
    const userId = tokenParsed.sub;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User is not found",
      });
    }

    let avatarPath;
    if(req.file && req.file.filename){
      avatarPath = `${constant.hostUrl}/uploads/avatar/${req.file.filename}`;
    }

    const updatedUserFields = {
      name: req.body.name || user.name,
      birthDate: req.body.birthDate || user.birthDate,
      phone: req.body.phone || user.phone,
      avatar: avatarPath || user.avatar,
      role: req.body.role || user.role,
      password: req.body.password || user.password,
      faculty: req.body.faculty || user.faculty,
      direction: req.body.direction || user.direction,
      group: req.body.group || user.group,
      grade: req.body.grade || user.grade,
    };

    // Update the user in the database
    const userUpdate = await User.findByIdAndUpdate(userId, updatedUserFields);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: true,
        message: "Access token is missing.",
      });
    }

    const token = authHeader && authHeader.split(" ")[1];

    const newBlacklistedToken = new Blacklist({
      token: token,
      userId: tokenParsed.sub,
    });

    newBlacklistedToken.save();
    
    let avatarForToken = avatarPath;

    if (avatarPath === null) {
      avatarForToken = user.avatar;
    }
    
    const tokenUpdate = generateAccessToken(
        userUpdate._id,
        userUpdate.role,
        userUpdate.isAdmin,
        avatarForToken
    );
    
    res.status(200).json({
      error: false,
      message: "User has been updated successfully",
      newToken: tokenUpdate,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}

async function logoutProfile(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: true,
        message: "Access token is missing.",
      });
    }

    const token = authHeader && authHeader.split(" ")[1];

    const tokenParsed = parseToken(req, res);

    const newBlacklistedToken = new Blacklist({
      token: token,
      userId: tokenParsed.sub,
    });

    newBlacklistedToken.save();

    return res.status(200).json({
      error: false,
      message: "Successfully logged out",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}

async function acceptDefaultUser(req, res) {
  try {
    const defaultUserId = req.body.userId;

    const user = await User.findById(defaultUserId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    user.isAdminVerified = true;
    await user.save();

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(20).toString("hex"), // random hex string for token
      usage: "Password Reset",
      expiredAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // A week
    });

    await token.save();

    req.body.email = user.email;

    emailHelper.sendResetPasswordEmail(req, token.token);

    return res.status(200).json({
      error: false,
      message: `Successfully verified ${user.name}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}

// Delete a user
async function deleteUser(req, res, next) {
  const userId = req.body.userId;
  const isUserExists = await User.findById(userId);

  if (!isUserExists) {
    return res.status(404).send({
      error: true,
      message: "User is not found.",
    });
  }

  try {
    await User.findByIdAndDelete(userId);

    return res.status(200).send({
      error: false,
      message: "User has been deleted successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      error: false,
      message: err.message,
    });
  }
}

module.exports = {
  registerUser,
  getUser,
  loginUser,
  changePassword,
  editProfile,
  logoutProfile,
  acceptDefaultUser,
  deleteUser,
};
