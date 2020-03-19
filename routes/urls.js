const { urlDataBase, usersDataBase } = require("../constants");
const express = require("express");
const router = express.Router();

const {
  generateRandomString,
  urlsForUser,
  currentDate
} = require("../helpers");

//urls index
router.get("/u", (req, res) => {
  if (usersDataBase[req.session.userId]) {
    const tamplateVars = {
      urls: urlsForUser(req.session.userId, urlDataBase),
      user: usersDataBase[req.session.userId]
    };
    res.render("urls_index", tamplateVars);
  } else {
    res.redirect("/");
  }
});

//handle url/new
router.get("/u/new", (req, res) => {
  const user = usersDataBase[req.session.userId];
  user ? res.render("urls_new", { user }) : res.redirect("/");
});

router.post("/u", (req, res) => {
  const createdAt = currentDate();
  const userID = req.session.userId;
  const shortURL = generateRandomString();
  const longURL =
    req.body.longURL.substr(0, 4) !== "http"
      ? `http://${req.body.longURL}`
      : req.body.longURL;
  urlDataBase[shortURL] = { longURL, userID, createdAt, visits: 0 };
  res.redirect(`/u`);
});

//handle shortURL
router.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDataBase[shortURL].longURL;
  if (!longURL) {
    res.statusCode = 404;
    res.send("404, Page Not Found");
  } else {
    urlDataBase[shortURL].visits++;
    res.redirect(longURL);
  }
});

//handle update
router.get("/u/:shortURL/update", (req, res) => {
  if (usersDataBase[req.session.userId]) {
    const { shortURL } = req.params;
    const userURLs = urlsForUser(req.session.userId, urlDataBase);
    if (userURLs[shortURL]) {
      const longURL = userURLs[shortURL].longURL;
      const tamplateVars = {
        shortURL,
        longURL,
        user: usersDataBase[req.session.userId]
      };
      res.render("url_show", tamplateVars);
    } else {
      res.statusCode = 418;
      res.send("sorry bro...");
    }
  } else {
    res.redirect("/");
  }
});

router.post("/u/:shortURL/update", (req, res) => {
  console.log(urlDataBase);
  const userURLs = urlsForUser(req.session.userId, urlDataBase);
  if (userURLs[req.params.shortURL]) {
    userURLs[req.params.shortURL].longURL =
      req.body.longURL.substr(0, 4) !== "http"
        ? `http://${req.body.longURL}`
        : req.body.longURL;
    urlDataBase[req.params.shortURL].longURL =
      userURLs[req.params.shortURL].longURL;
    console.log(urlDataBase);
    res.redirect("/u");
  }
});

//handle delete
router.post("/u/:shortURL/delete", (req, res) => {
  const userURLs = urlsForUser(req.session.userId, urlDataBase);
  if (userURLs[req.params.shortURL]) {
    delete userURLs[req.params.shortURL];
    delete urlDataBase[req.params.shortURL];
    res.redirect("/u");
  } else {
    res.statusCode = 420;
    res.send("ARE YOU HIGH ?!");
  }
});

module.exports = router;
