require("dotenv/config");
const crypto = require("crypto");

const constant = {
  dbConnection: process.env.DB_CONNECTION,
  dbName: process.env.DB_NAME,
  apiUrl: process.env.API_URL,
  emailAddress: process.env.EMAIL_ADDRESS,
  emailPassword: process.env.EMAIL_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  hostUrl: process.env.HOST_URL,
  nonce: crypto.randomBytes(16).toString("base64"),
  serverEmail: '"MyTSU Classroom" <no-reply@mytsuclassroom.my.id>',
};

module.exports = constant;
