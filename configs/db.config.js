const mongoose = require("mongoose");
const constant = require("../middleware/constants");

const setupDatabase = () => {
  mongoose
    .connect(constant.dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: constant.dbName,
    })
    .then(() => {
      console.log("Database connected...");
    })
    .catch((err) => {
      console.log("Database is not connected...");
      console.log(err);
    });
};

module.exports = setupDatabase;
