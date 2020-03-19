const { usersDataBase } = require("../constants");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { generateRandomString, checkDataBase } = require("../helpers");

/* handle registration. */
router.get("/register", (req, res) => {
  res.render("register_form", {
    user: usersDataBase[req.session.userId],
    err: null
  });
});

router.post("/register", (req, res) => {
  if (!checkDataBase(req.body.email, usersDataBase, "email")) {
    const id = generateRandomString();
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      const { name, email } = req.body;
      usersDataBase[id] = { id, name, email, password: hash };
      req.session.userId = id;
      console.log(usersDataBase);
      res.redirect("/u");
    });
  } else {
    res.statusCode = 400;
    res.render("register_form", {
      user: undefined,
      err: "email already in use"
    });
  }
});

module.exports = router;
