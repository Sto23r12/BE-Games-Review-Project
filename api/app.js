const express = require("express");
const {
  getStatus,
  getCategories,
  getReviews,
  getComments,
  getEndpoints,
  getReviewsById,
  getEndpoint,
  getCommentsById,
} = require("../api/app.controller");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api", getEndpoint);

app.get("/api/reviews/:review_id", getReviewsById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsById);

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
