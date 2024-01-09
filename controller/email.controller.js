const { User } = require("../models/user.model");
const { Token } = require("../models/token.model");
const constant = require("../middleware/constants");
const emailHelper = require("../helper/email.helper");
const crypto = require("crypto");

async function verifyEmail(req, res) {
  const publicPath = `${constant.hostUrl}${constant.apiUrl}/public`;

  try {
    const token = req.params.token;

    const verificationToken = await Token.findOne({ token: token });

    if (!verificationToken || Date.now() > verificationToken.expiredAt) {
      return res.status(400).render("email_confirmation", {
        message: "Invalid or expired verification token.",
        logo: `${publicPath}/wpf_books.svg`,
      });
    }

    const user = await User.findById(verificationToken.userId);

    if (!user) {
      return res.status(400).render("email_confirmation", {
        message: "User not found.",
        logo: `${publicPath}/wpf_books.svg`,
      });
    }

    // Mark the user as verified and remove the verification token
    user.isEmailVerified = true;
    await user.save();
    await Token.findByIdAndDelete({ _id: verificationToken._id });

    return res.status(200).render("email_confirmation", {
      message: "Your email account has been verified.",
      logo: `${publicPath}/wpf_books.svg`,
    });
  } catch (err) {
    return res.status(400).send({
      error: true,
      message: err.message,
    });
  }
}

function viewResetPasswordPage(req, res) {
  return res.status(200).render("reset_password", {
    path: `${constant.apiUrl}/public`,
    token: req.query.token,
    nonce: constant.nonce,
  });
}

async function changePassword(req, res) {
  try {
    if (req.query.token === undefined) {
      return res.status(403).json({
        error: true,
        message: "Token is required to change password",
      });
    }

    const token = req.query.token;
    const isTokenStored = await Token.findOne({ token: token });

    if (isTokenStored.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Token is not found",
      });
    }

    const user = await User.findOne({ _id: isTokenStored.userId });
    if (user.length === 0) {
      return res.status(404).json({
        error: true,
        message: "User is not found",
      });
    }
    console.log(`User: ${user}`);

    const password = req.body.password.toString();
    const retypePassword = req.body.confirm_password.toString();

    if (password !== retypePassword) {
      return res.status(400).json({
        error: true,
        message: "Password and password confirmation does not match",
      });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({
      error: false,
      message: "Password has been changed successfully",
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: err.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

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

module.exports = {
  verifyEmail,
  viewResetPasswordPage,
  changePassword,
  forgotPassword,
};
