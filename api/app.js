const express = require("express");
const {
  getStatus,
  getCategories,
  getReviews,
  getComments,
  getEndpoints,
} = require("../api/app.controller");
const { getReviewById } = require("./app.models");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api", getStatus);

app.get("/api/reviews", getReviews);

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
