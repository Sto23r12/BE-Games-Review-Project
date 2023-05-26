const db = require("../db/connection");
const endpoints = require("../endpoints.json");

exports.getEndpoints = () => {
  return db
    .query(
      "SELECT * FROM information_schema.tables WHERE table_schema = 'nc_games_test'"
    )
    .then((endpoint) => {
      return { endpoint: Object.keys(endpoints) };
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
exports.getComment = (id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC",
      [id]
    )
    .then((comments) => {
      // if (!comments.rows.length) {
      //   return Promise.reject({ status: 400, msg: "Invalid id number!" });
      // } else {
      if (!comments.rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found!" });
      }
      return comments.rows;
    });
};

exports.postComment = (review_id, username, body) => {
  // console.log(review_id, username, body);

  return db
    .query(
      "INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [review_id, username, body]
    )
    .then((result) => {
      if (!username || !body) {
        return Promise.reject({ status: 400, msg: "Invalid request" });
      } else {
        return result.rows[0];
      }
    });
};
