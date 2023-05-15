const db = require("../db/connection");
const { request } = require("./app");

exports.getEndpoints = () => {
  return db
    .query(
      "SELECT * FROM information_schema.tables WHERE table_schema = 'nc_games_test'"
    )
    .then((endpoints) => {
      return endpoints.rows;
    });
};

exports.getCategory = () => {
  return db.query("SELECT * FROM categories").then((categories) => {
    return categories.rows;
  });
};
exports.getReviewById = (id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [id])
    .then((review) => {
      return review.rows;
    });
};
exports.getReview = () => {
  return db
    .query(
      "SELECT r.review_id, r.title, r.category, r.designer, r.owner, r.review_img_url, r.created_at, r.votes, COUNT(c.comment_id) AS comment_count FROM reviews AS r LEFT JOIN comments AS c ON r.review_id = c.review_id GROUP BY r.review_id ORDER BY created_at DESC"
    )
    .then((reviews) => {
      return reviews.rows;
    });
};
