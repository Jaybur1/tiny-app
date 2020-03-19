const {
  generateRandomString,
  checkDataBase,
  getId,
  urlsForUser
} = require("./factories");
const { urlDataBase, usersDataBase } = require("./constants");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.use("/public/images/", express.static("./public/images"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { user: usersDataBase[req.cookies.user_id] });
});

app.get("/login", (req, res) => {
  res.render("login_form", { user: null, err: null });
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (getId(email, password, usersDataBase)) {
    res.cookie("user_id", getId(email, password, usersDataBase));
    res.redirect("/u");
  } else {
    res.statusCode = 403;
    res.render("login_form", {
      user: undefined,
      err: `Incorrect Email/Password was enterd ... try again`
    });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/");
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
  if (usersDataBase[req.cookies.user_id]) {
    const tamplateVars = {
      urls: urlsForUser(req.cookies.user_id, urlDataBase),
      user: usersDataBase[req.cookies.user_id]
    };
    res.render("urls_index", tamplateVars);
  } else {
    res.redirect("/");
  }
});

app.post("/u", (req, res) => {
  const userID = req.cookies.user_id;
  const shortURL = generateRandomString();
  const longURL =
    req.body.longURL.substr(0, 4) !== "http"
      ? `http://${req.body.longURL}`
      : req.body.longURL;
  urlDataBase[shortURL] = { longURL, userID };
  res.redirect(`/u`);
});

app.get("/u/new", (req, res) => {
  const user = usersDataBase[req.cookies.user_id];
  user ? res.render("urls_new", { user }) : res.redirect("/");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDataBase[shortURL].longURL;
  if (!longURL) {
    res.statusCode = 404;
    res.send("404, Page Not Found");
  } else {
    res.redirect(longURL);
  }
});

app.get("/u/:shortURL/update", (req, res) => {
  if (usersDataBase[req.cookies.user_id]) {
    const { shortURL } = req.params;
    const userURLs = urlsForUser(req.cookies.user_id, urlDataBase);
    if (userURLs[shortURL]) {
      const longURL = userURLs[shortURL].longURL;
      const tamplateVars = {
        shortURL,
        longURL,
        user: usersDataBase[req.cookies.user_id]
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

app.post("/u/:shortURL/update", (req, res) => {
  console.log(urlDataBase);
  const userURLs = urlsForUser(req.cookies.user_id, urlDataBase);
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

app.post("/u/:shortURL/delete", (req, res) => {
  const userURLs = urlsForUser(req.cookies.user_id, urlDataBase);
  if (userURLs[req.params.shortURL]) {
    delete userURLs[req.params.shortURL];
    delete urlDataBase[req.params.shortURL];
    res.redirect("/u");
  } else {
    res.statusCode = 420;
    res.send("ARE YOU HIGH ?!");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
