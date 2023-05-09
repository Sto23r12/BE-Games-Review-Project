const express = require("express");
const {
  getStatus,
  getCategory,
  getCategories,
} = require("../api/app.controller");

const app = express();
app.use(express.json());

app.get("/api", getStatus);

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send("Server Error!");
});

module.exports = app;
