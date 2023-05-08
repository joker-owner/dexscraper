const express = require("express");
const app = express();
const httpStatus = require("http-status");
const routes = require("./route");

process.env.PWD = process.cwd();

app.set('views', `${process.env.PWD}/views`);
app.set('view engine', 'ejs');

app.use(express.static(`${process.env.PWD}/`));
app.use(express.static(`${process.env.PWD}/resources`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  res.send("Bad request");
});

module.exports = app;