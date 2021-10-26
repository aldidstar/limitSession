module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.session.user) {
      next();
      var hour = 5000;
      req.session.cookie.expires = new Date(Date.now() + hour);
      req.session.cookie.maxAge = hour;
    } else {
      res.redirect("/index");
    }
  },
};
