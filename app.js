const express = require("express");
const httpStatus = require("http-status");
const routes = require("./route");

process.env.PWD = process.cwd();

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(`${process.env.PWD}/`));
app.use(express.static(`${process.env.PWD}/resources`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

module.exports = app;