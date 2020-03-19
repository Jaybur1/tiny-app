const { usersDataBase } = require("../constants");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getId } = require("../factories");

/* handle login page. */
router.get("/login", (req, res) => {
  res.render("login_form", { user: null, err: null });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (getId(email, usersDataBase)) {
    const id = getId(email, usersDataBase);
    bcrypt.compare(password, usersDataBase[id].password, (err, result) => {
      if (result) {
        req.session.userId = id;
        res.redirect("/u");
      } else {
        res.statusCode = 403;
        res.render("login_form", {
          user: undefined,
          err: `Incorrect Email/Password was enterd ... try again`
        });
      }
    });
  } else {
    res.statusCode = 403;
    res.render("login_form", {
      user: undefined,
      err: `Incorrect Email/Password was enterd ... try again`
    });
  }
});

module.exports = router;
