const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieSession = require("cookie-session");
const indexRouter = require("./routes/index");


const app = express();
const PORT = 8080;

app.use("/public/images/", express.static("./public/images"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["userId"]
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//handle Routing
app.use('/',indexRouter);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
