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
  test("GET - Status: 200 - returns all endpoints which are available to access", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        return response.body;
      });
  });
});

describe("/api/categories", () => {
  describe("Returns with the correct JSON endpoint", () => {
    test("/api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const input = response.body.endpoints.endpoint;
          const expectedOutput = Object.keys(endpoint);
          expect(input).toMatchObject(expectedOutput);
        });
    });
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
  const review_id = 2;
  return request(app)
    .get(`/api/reviews/${review_id}/comments`)
    .expect(200)
    .then((response) => {
      expect(response.body.comments).toBeSortedBy("created_at", {
        descending: true,
      });
      response.body.comments.forEach((comment) => {
        expect(Object.keys(comment).length).toBe(6);
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.review_id).toBe("number");
      });
    });
});
// test("returns an error message of 'Comment not found!' and error 404 if review_id is valid but has no comments", () => {
//   const review_id = 1;
//   return request(app)
//     .get(`/api/reviews/${review_id}/comments`)
//     .expect(404)
//     .then((response) => {
//       console.log(response.body);
//       expect(response.body).toEqual({ msg: "Comment not found!" });
//     });
// });
test('returns an error message of "Invalid id number!" and error 404 if review_id is not valid', () => {
  const review_id = 45;
  return request(app)
    .get(`/api/reviews/${review_id}/comments`)
    .expect(403)
    .then((response) => {
      expect(response.body).toEqual({ msg: "Invalid id number!" });
    });
});

describe("Post - Returns with status code of 201 and should push into the commments", () => {
  test("returns 201 for a new comment added", () => {
    const review_id = 1;
    const comment = { username: "dav3rid", body: "This is a test!" };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .expect(201)
      .send(comment)
      .then((postRequest) => {
        expect(postRequest.body.author).toBe("dav3rid");
        expect(postRequest.body.body).toBe("This is a test!");
        expect(typeof postRequest.body.comment_id).toBe("number");
        expect(typeof postRequest.body.votes).toBe("number");
        expect(typeof postRequest.body.author).toBe("string");
        expect(typeof postRequest.body.body).toBe("string");
      });
  });
  //   test.only("returns 404 if the username is not valid", () => {
  //     // const review_id = 1;
  //     //const comment = { username: "Akihisa Okui", body: "Test" };
  //     return request(app)
  //       .post(`/api/reviews/1/comments`)
  //       .expect(404)
  //       .send({ username: "Akihisa Okui", body: "Test" })
  //       .then((response) => {
  //         console.log(response.body.msg);
  //         expect(response.body.msg).toBe("No author found");
  //       });
  //   });
  // });
});
