var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const saltRounds = 10;
const helpers = require("../helpers/util");
// var moment = require("moment");
const { query } = require("express");

module.exports = function (db) {
  router.get("/", helpers.isLoggedIn, (req, res, next) => {
    res.render("partials/navbar", { info: req.flash("info") });
  });

  return router;
};
