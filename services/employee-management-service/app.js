const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const authHandler = require("./authHandler");

const db = require("./models");
require("dotenv").config();

const apiRoutes = require("./routes/api");
const loginRoutes = require("./routes/login/login.routes");
const registerRoutes = require("./routes/register/register.routes");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

db.sequelize.sync({ alter: true });

app.use("/api", apiRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);

app.get("/checkToken", authHandler.checkToken);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
