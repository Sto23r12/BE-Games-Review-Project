const request = require("supertest");
const app = require("../api/app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

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
