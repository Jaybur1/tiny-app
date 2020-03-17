const { generateRandomString } = require('./factories');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDataBase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const tamplateVars = { urls: urlDataBase };
  res.render("urls_index", tamplateVars);
});

app.post("/urls", (req, res) => {
  urlDataBase[generateRandomString()] = req.body.longURL; // Log the POST request body to the console
  res.json(urlDataBase);         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render('urls_new');
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDataBase[shortURL];
  const tamplateVars = { shortURL, longURL };
  res.render("url_show", tamplateVars);
});


app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
