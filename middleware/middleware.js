const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
const constant = require("../middleware/constants");

const setupMiddleware = (app) => {
  app.use(morgan("dev"));
  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", (req, res) => `'nonce-${constant.nonce}'`],
        },
      },
    })
  );
  app.options("*", cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(`${constant.apiUrl}/public`, express.static("public"));
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "ejs");
};

module.exports = setupMiddleware;
