const { urlDataBase, usersDataBase } = require("./constants");
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 8080;
const {
  generateRandomString,
  checkDataBase,
  getId,
  urlsForUser
} = require("./factories");

app.use("/public/images/", express.static("./public/images"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["userId"]
  })
);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { user: usersDataBase[req.session.userId] });
});

app.get("/login", (req, res) => {
  res.render("login_form", { user: null, err: null });
});
app.post("/login", (req, res) => {
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
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register_form", {
    user: usersDataBase[req.session.userId],
    err: null
  });
});

app.post("/register", (req, res) => {
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

app.get("/u", (req, res) => {
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

app.post("/u", (req, res) => {
  const userID = req.session.userId;
  const shortURL = generateRandomString();
  const longURL =
    req.body.longURL.substr(0, 4) !== "http"
      ? `http://${req.body.longURL}`
      : req.body.longURL;
  urlDataBase[shortURL] = { longURL, userID };
  res.redirect(`/u`);
});

app.get("/u/new", (req, res) => {
  const user = usersDataBase[req.session.userId];
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

app.post("/u/:shortURL/update", (req, res) => {
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

app.post("/u/:shortURL/delete", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
