const { generateRandomString } = require("./factories");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDataBase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.redirect("/u");
});

app.get("/u", (req, res) => {
  const tamplateVars = { urls: urlDataBase };
  res.render("urls_index", tamplateVars);
});

app.post("/u", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL.substr(0,4) !== "http" ? `http://${req.body.longURL}` : req.body.longURL;
  urlDataBase[shortURL] = longURL; // Log the POST request body to the console
  res.redirect(`/u/${shortURL}`); // Respond with 'Ok' (we will replace this)
});

app.get("/u/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDataBase[shortURL];
  if (!longURL) {
    res.statusCode = 404;
    res.send("404, Page Not Found");
  } else {
    // const tamplateVars = { shortURL, longURL };
    res.redirect(longURL);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
