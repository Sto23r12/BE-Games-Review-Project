const express = require("express");
const cors = require("cors");
const {
  getStatus,
  getCategories,
  getReviews,
  getComments,
  getEndpoints,
  getReviewsById,
  getEndpoint,
  getCommentsById,
  postComments,
  updateVotes,
  patchReviewById,
} = require("../api/app.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api", getEndpoint);

app.get("/api/reviews/:review_id", getReviewsById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsById);

app.post("/api/reviews/:review_id/comments", postComments);

app.patch("/api/reviews/:review_id", patchReviewById);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.status === 400) {
    res.status(400).send({ msg: "Invalid request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "No author found" });
  } else {
    next(err);
  }
});

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
