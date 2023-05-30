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
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return response.rows;
    });
};

exports.postComment = (review_id, username, body) => {
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

exports.updateReviewById = (update, reviewId) => {
  if (!update.hasOwnProperty("inc_votes")) {
    return Promise.reject({
      status: 400,
      message: "Invalid request",
    });
  } else if (typeof update.inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      message: "Invalid request",
    });
  }
  if (!reviewId) {
    return Promise.reject({
      status: 404,
      msg: "Not found",
    });
  }
  const queryString = `UPDATE reviews SET votes = votes + ($1) WHERE review_id = ($2) RETURNING *;`;
  const queryValues = [update.inc_votes, reviewId];
  return this.getReviewById(reviewId).then(() => {
    return db.query(queryString, queryValues).then(({ rows }) => {
      return rows[0];
    });
  });
};
