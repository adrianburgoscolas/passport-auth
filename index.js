require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");

const db = require("./db/connect");
const mainRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const sessionConfig = require("./config/sessions");
const notFound = require("./middleware/notfound");

const app = express();

db.connect();

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger("dev"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/", mainRouter);
app.use("/", authRouter);

app.use(notFound);

const port = process.env.PORT || 3001;

app.listen(port, () => {console.log("Listening")});
