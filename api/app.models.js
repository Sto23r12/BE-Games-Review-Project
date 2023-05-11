const db = require("../db/connection");
const { request } = require("./app");

exports.getCategory = () => {
  return db.query("SELECT * FROM categories").then((categories) => {
    return categories.rows;
  });
};
exports.getReview = () => {
  // const wantedId = req.params.id;
  return db.query(`SELECT * FROM reviews`).then((reviews) => {
    return reviews.rows;
  });
};

exports.getReviewById = (req, res) => {
  const wantedId = req.params.id;
  console.log(wantedId);
  return db.query(`SELECT ${wantedId} FROM reviews`).then((reviews) => {
    return reviews.rows;
  });
};
