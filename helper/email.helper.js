// ----------------------------------------------------------------
// This helper file is only sending email messages
// It consist of email sender & receiver information and email body
// ----------------------------------------------------------------

const { emailTransporter } = require("../configs/email.config");
const path = require("path");
const constant = require("../middleware/constants");

async function sendVerificationEmail(req, token) {
  const emailBody = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Email Verification</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #2d85c5; font-family: 'Montserrat', sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="20">
          <tr>
              <td align="center">
                  <table role="presentation" width="600" cellspacing="0" cellpadding="0">
                      <tr>
                          <td>
                              <table role="presentation" width="100%" cellspacing="40" cellpadding="0" style="background-color: #fff; padding: 20px; border-radius: 10px; justify-content: center;">
                                  <tr>
                                      <td align="center">
                                          <div style="display: flex; vertical-align: middle; justify-content: center;">
                                              <img src="cid:logo" alt="logo" width="360" height="35" style="display: block; width: 47px; height: auto; max-height: 35px; margin-right: 15px">
                                              <h1 style="color: #333; font-weight: 900; font-size: 30px; margin: 0;">MyTSU Classroom</h1>
                                          </div>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="color: #333; font-weight: 500; font-size: 20px; margin-bottom: 40px; text-align: center;">
                                          Welcome! Please verify your email account within 30 minutes.
                                      </td>
                                  </tr>
                                  
                                  <tr>
                                      <td style="color: #333; font-size: 18px; text-align: center;">
                                          Upon completion, your account will undergo verification by the administrator to confirm your account status. This process may take a while. Thank you for registering your account.
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="center">
                                          <a href="${constant.hostUrl}/api/verify/${token}" style="background-color: #2d85c5; color: #fff; text-decoration: none; padding: 10px 30px; border-radius: 100px; font-weight: bold; font-size: 20px;">Verify Email</a>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `;
  try {
    await emailTransporter.sendMail({
      from: '"MyTSU Classroom" <no-reply@mytsuclassroom.my.id>',
      to: req.body.email,
      subject: "Confirm email address for MyTSU Classroom",
      html: emailBody,
      attachments: [
        {
          filename: "wpf_books.png",
          path: path.join(__dirname, "..", "public", "wpf_books.png"),
          cid: "logo",
        },
      ],
    });
    console.log(`Email sent to ${req.body.email} for email verification`);
  } catch (err) {
    console.error("Error sending email:", err);
    if (err.responseCode) {
      console.error("SMTP Response Code:", err.responseCode);
      console.error("SMTP Response:", err.response);
    }
    throw err;
  }
}

async function sendResetPasswordEmail(req, token) {
  const emailBody = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #2d85c5;
      font-family: 'Montserrat', sans-serif;
    "
  >
    <table role="presentation" width="100%" cellspacing="0" cellpadding="20">
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="600"
            cellspacing="0"
            cellpadding="0"
          >
            <tr>
              <td>
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="40"
                  cellpadding="0"
                  style="
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    justify-content: center;
                  "
                >
                  <tr>
                    <td align="center">
                      <div
                        style="
                          display: flex;
                          vertical-align: middle;
                          justify-content: center;
                        "
                      >
                        <img
                          src="cid:logo"
                          alt="logo"
                          width="360"
                          height="35"
                          style="
                            display: block;
                            width: 47px;
                            height: auto;
                            max-height: 35px;
                            margin-right: 15px;
                          "
                        />
                        <h1
                          style="
                            color: #333;
                            font-weight: 900;
                            font-size: 30px;
                            margin: 0;
                          "
                        >
                          MyTSU Classroom
                        </h1>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="color: #333; font-size: 18px; text-align: center"
                    >
                      Hello! We are pleased to inform you that your account has
                      been successfully verified by the administrator. As a
                      security measure, we recommend updating your profile's
                      password before proceeding to access MyTSU Classroom.
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        href="${constant.hostUrl}/api/resetpassword?token=${token}"
                        style="
                          background-color: #2d85c5;
                          color: #fff;
                          text-decoration: none;
                          padding: 10px 30px;
                          border-radius: 100px;
                          font-weight: 600;
                          font-size: 18px;
                        "
                        >Change password</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  try {
    await emailTransporter.sendMail({
      from: '"MyTSU Classroom" <no-reply@mytsuclassroom.my.id>',
      to: req.body.email,
      subject: "Account Verification and Password Change",
      html: emailBody,
      attachments: [
        {
          filename: "wpf_books.png",
          path: path.join(__dirname, "..", "public", "wpf_books.png"),
          cid: "logo",
        },
      ],
    });
    console.log(`Email sent to ${req.body.email} for password change`);
  } catch (err) {
    console.error("Error sending email:", err);
    if (err.responseCode) {
      console.error("SMTP Response Code:", err.responseCode);
      console.error("SMTP Response:", err.response);
    }
    throw err;
  }
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
