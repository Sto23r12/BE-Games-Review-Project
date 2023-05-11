const db = "../db/connection.js";
const { categoryData } = require("../db/data/test-data");
const { request } = require("./app");
const { getCategory, getReview, getReviewById } = require("./app.models");
const { endpoint } = require("../endpoints.json");

exports.getStatus = (request, response) => {
  response.status(200).send({ message: "all ok" });
};

exports.getCategories = (request, response, next) => {
  getCategory()
    .then((category) => {
      response.status(200).send({ categories: category });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getReviews = (request, response, next) => {
  // const wantedId = request.params.id;
  // const body = request.body;
  getReview()
    .then((review) => {
      response.status(200).send({ reviews: review });
    })
    .catch((err) => {
      next(err);
    });
};
