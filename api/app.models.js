const db = require("../db/connection");
const { request } = require("./app");

exports.getCategory = () => {
  return db.query("SELECT * FROM categories").then((categories) => {
    return categories.rows;
  });
};
