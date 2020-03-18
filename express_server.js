const { generateRandomString, checkDataBase ,getId} = require("./factories");
const { urlDataBase, usersDataBase } = require("./constants");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/u");
});

app.get("/login", (req, res) => {
  res.render("login_form", { user: null, err: null });
});
app.post("/login", (req, res) => {
  const {email , password} = req.body;
  if (getId(email,password,usersDataBase)) {
    res.cookie('user_id', getId(email,password,usersDataBase));
    res.redirect('/u');
  } else {
    res.send("bad");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/u");
});

app.get("/register", (req, res) => {
  res.render("register_form", {
    user: usersDataBase[req.cookies.user_id],
    err: null
  });
});

app.post("/register", (req, res) => {
  if (!checkDataBase(req.body.email, usersDataBase, "email")) {
    const id = generateRandomString();
    usersDataBase[id] = { id, ...req.body };
    res.cookie("user_id", id);
    res.redirect("/u");
  } else {
    res.statusCode = 400;
    res.render("register_form", {
      user: undefined,
      err: "email already in use"
    });
  }
});

app.get("/u", (req, res) => {
  const tamplateVars = {
    urls: urlDataBase,
    user: usersDataBase[req.cookies.user_id]
  };
  console.log(tamplateVars.user);
  res.render("urls_index", tamplateVars);
});

app.post("/u", (req, res) => {
  const shortURL = generateRandomString();
  const longURL =
    req.body.longURL.substr(0, 4) !== "http"
      ? `http://${req.body.longURL}`
      : req.body.longURL;
  urlDataBase[shortURL] = longURL;
  res.redirect(`/u`);
});

app.get("/u/new", (req, res) => {
  const user = usersDataBase[req.cookies.user_id];
  res.render("urls_new", user);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDataBase[shortURL];
  if (!longURL) {
    res.statusCode = 404;
    res.send("404, Page Not Found");
  } else {
    res.redirect(longURL);
  }
});

app.get("/u/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDataBase[shortURL];
  const tamplateVars = {
    shortURL,
    longURL,
    user: usersDataBase[req.cookies.user_id]
  };

  res.render("url_show", tamplateVars);
});

app.post("/u/:shortURL/update", (req, res) => {
  urlDataBase[req.params.shortURL] =
    req.body.longURL.substr(0, 4) !== "http"
      ? `http://${req.body.longURL}`
      : req.body.longURL;
  res.redirect("/u");
});

app.post("/u/:shortURL/delete", (req, res) => {
  delete urlDataBase[req.params.shortURL];
  res.redirect("/u");
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
