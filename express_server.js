const { generateRandomString } = require("./factories");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDataBase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.redirect("/u");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/u");
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/u');
});
app.get("/u", (req, res) => {
  const tamplateVars = { urls: urlDataBase, username: req.cookies.username };
  res.render("urls_index", tamplateVars);
});

app.post("/u", (req, res) => {
  const shortURL = generateRandomString();
  const longURL =
    req.body.longURL.substr(0, 4) !== "http"
      ? `http://${req.body.longURL}`
      : req.body.longURL;
  urlDataBase[shortURL] = longURL; // Log the POST request body to the console
  res.redirect(`/u`); // Respond with 'Ok' (we will replace this)
});

app.get("/u/new", (req, res) => {
  const username = { username: req.cookies.username };
  res.render("urls_new", username);
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
  const tamplateVars = { shortURL, longURL, username: req.cookies.username };

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
