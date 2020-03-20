const { usersDataBase } = require("../constants");
const express = require("express");
const router = express.Router();
const loginRouter = require("./login");
const logoutRouter = require("./logout");
const registerRouter = require("./register");
const urlsRouter = require("./urls");

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { user: usersDataBase[req.session.userId] });
});

//handle Login
router.get("/login", loginRouter);
router.post("/login", loginRouter);

//handle logout
router.post("/logout", logoutRouter);

//handle registration
router.get("/register", registerRouter);
router.post("/register", registerRouter);

//handle urls page
router.get("/u", urlsRouter);

//handle newroute
router.get("/u/new", urlsRouter);
router.post("/u", urlsRouter);

//handle shorturls
router.get("/u/:shortURL", urlsRouter);

//handle shorturl edit
router.get("/u/:shortURL/update", urlsRouter);
router.put("/u/:shortURL", urlsRouter);

//handle delete
router.delete("/u/:shortURL", urlsRouter);

module.exports = router;
