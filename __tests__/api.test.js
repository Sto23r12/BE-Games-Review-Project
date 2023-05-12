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
