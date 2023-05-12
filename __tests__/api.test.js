const request = require("supertest");
const app = require("../api/app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const endpoint = require("../endpoints.json");
const sorted = require("jest-sorted");

afterAll(() => {
  return db.end();
});
beforeEach(() => {
  return seed(testData);
});

describe("/api", () => {
  test("GET - Status: 200 - returns an object with message 'all ok'", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ message: "all ok" });
      });
  });
});

describe("/api/categories", () => {
  test('GET - Status: 200 - returns an array of category objects, each of which having the properties "slug", "description"', () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        response.body.categories.forEach((category) => {
          expect(typeof category.description).toBe("string");
          expect(typeof category.slug).toBe("string");
          expect(response.body.categories.length).toBe(4);
          expect(response.body.categories[0]).toEqual({
            slug: "euro game",
            description: "Abstact games that involve little luck",
          });
          expect(response.body.categories[2]).toEqual({
            slug: "dexterity",
            description: "Games involving physical skill",
          });
        });
      });
  });
});

describe("Returns with the correct JSON endpoint", () => {
  test("/api/categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const input = Object.keys(
          endpoint["GET /api/categories"].exampleResponse
        );
        const expectedOutput = Object.keys(response.body);
        expect(input).toMatchObject(expectedOutput);
      });
  });
  test("/api/reviews/:review_id", () => {
    const review_id = 3;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then((response) => {
        const review = response.body.review[0];
        expect(typeof review.title).toBe("string");
        expect(typeof review.created_at).toBe("string");
        expect(typeof review.votes).toBe("number");
        expect(typeof review.review_id).toBe("number");
        expect(typeof review.designer).toBe("string");
        expect(typeof review.review_img_url).toBe("string");
        expect(typeof review.category).toBe("string");
        expect(typeof review.review_body).toBe("string");
        expect(typeof review.owner).toBe("string");
      });
  });
});
test("/api/reviews", () => {
  return request(app)
    .get("/api/reviews")
    .expect(200)
    .then((response) => {
      expect(response.body.reviews.length).toBe(13);
      expect(response.body.reviews).toBeSortedBy("created_at", {
        descending: true,
      });
      response.body.reviews.forEach((review) => {
        expect(typeof review.review_id).toBe("number");
        expect(typeof review.title).toBe("string");
        expect(typeof review.created_at).toBe("string");
        expect(typeof review.votes).toBe("number");
        expect(typeof review.comment_count).toBe("string");
        expect(typeof review.owner).toBe("string");
        expect(typeof review.category).toBe("string");
        expect(typeof review.review_img_url).toBe("string");
        expect(typeof review.designer).toBe("string");
      });
    });
});
test("/api/reviews/:reviews_id/comments", () => {
  const review_id = 3;
  return request(app)
    .get(`/api/reviews/${review_id}/comments`)
    .expect(200)
    .then((response) => {
      expect(response.body.comments.length).toBe(3);
      expect(response.body.comments).toBeSortedBy("created_at", {
        descending: true,
      });
      response.body.comments.forEach((comment) => {
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.review_id).toBe("number");
      });
    });
});
