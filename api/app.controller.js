const db = "../db/connection.js";
const { categoryData } = require("../db/data/test-data");
const { request } = require("./app");
const { getCategory } = require("./app.models");

exports.getStatus = (request, response) => {
  response.status(200).send({ message: "all ok" });
};

exports.getCategories = (request, response) => {
  getCategory().then((category) => {
    response.status(200).send({ categories: category });
  });
};
