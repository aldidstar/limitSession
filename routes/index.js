var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const helpers = require("../helpers/util");

module.exports = function (db) {
  var count = -1;
  count += 1;
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

        // jika salah email / password
        if (row.rows.length == 0) {
          count += 1;

          // jika mencoba login lebih dari 5 kali
          if (count > 5) {
            setTimeout(function () {
              count = 0;
            }, 30000);
            req.flash("info", "tunggu 30 detik lalu refresh");
          } else {
            req.flash("info", `Gagal ${count} kali. email / password salah!`);
          }

          return res.redirect("/index");
        }
        // membcrypt password untuk mencocokkan sesuai atau tidak
        bcrypt.compare(
          req.body.password,
          row.rows[0].password,
          function (err, result) {
            if (result) {
              if (count > 5) {
                setTimeout(function () {
                  count = 0;
                  res.redirect("/users");
                }, 30000);
                req.flash("info", "tunggu 30 detik lalu refresh");
              } else {
                req.session.user = row.rows[0];

                // masuk ke landing page
                res.redirect("/users");
              }
            } else {
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
