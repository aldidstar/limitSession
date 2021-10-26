var express = require("express");
var router = express.Router();
// var moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const helpers = require("../helpers/util");

module.exports = function (db) {
  router.get("/", (req, res, next) => {
    res.render("index/login", { info: req.flash("info") });
  });

  router.post("/", (req, res, next) => {
    db.query(
      "select * from users where email = $1",
      [req.body.email],
      (err, row) => {
        if (err) {
          req.flash("info", "Salah nihh!");
          return res.redirect("/index");
        }
        if (row.rows.length == 0) {
          let tes1 = setInterval(function () {
            // console.log("Hello");
          }, 10000);
          let tes = req.body.password;
          let availableCars = [{ tes }, { tes }, { tes }, { tes }, , { tes1 }];
          availableCars.push(req.body.password);
          console.log(row.rows.length);
          req.flash("info", "email / password salah!");
          return res.redirect("/index");
        }
        bcrypt.compare(
          req.body.password,
          row.rows[0].password,
          function (err, result) {
            if (result) {
              req.session.user = row.rows[0];
              res.redirect("/users");
            } else {
              // availableCars.push(req.body.password);
              // console.log(availableCars);
              req.flash("info", "email / password salah!");
              res.redirect("/index");
            }
          }
        );
      }
    );
  });

  router.get("/logout", function (req, res, next) {
    req.session.destroy(function (err) {
      res.redirect("/index");
    });
  });

  return router;
};
