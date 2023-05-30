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
test("returns an error message of 'Comment not found!' and error 404 if review_id is valid but has no comments", () => {
  const review_id = 1;
  return request(app)
    .get(`/api/reviews/${review_id}/comments`)
    .expect(404)
    .then((response) => {
      expect(response.body).toEqual({ msg: "Not found" });
    });
});
test('returns an error message of "Not found!" and status 404 if review_id does not exist', () => {
  const review_id = 45;
  return request(app)
    .get(`/api/reviews/${review_id}/comments`)
    .expect(404)
    .then((response) => {
      expect(response.body).toEqual({ msg: "Not found" });
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
  test("returns 404 if the username is not valid", () => {
    const review_id = 1;
    const comment = { username: "Akihisa Okui", body: "Test" };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .expect(404)
      .send(comment)
      .then((response) => {
        expect(response.body.msg).toBe("No author found");
      });
  });
  test("Should ignore additional properties", () => {
    const review_id = 1;
    const comment = {
      username: "dav3rid",
      body: "This is a test!",
      extraProp: "dsad",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .expect(201)
      .send(comment)
      .then((postRequest) => {
        expect(postRequest.body.author).toBe("dav3rid");
        expect(postRequest.body.body).toBe("This is a test!");
        expect(postRequest.body).not.toHaveProperty("extraProp");
        expect(typeof postRequest.body.comment_id).toBe("number");
        expect(typeof postRequest.body.votes).toBe("number");
        expect(typeof postRequest.body.author).toBe("string");
        expect(typeof postRequest.body.body).toBe("string");
      });
  });
  test("should return with 400 if an invalid id is passed", () => {
    // const review_id = "Not an id";
    const comment = { username: "dav3rid", body: "This is a test!" };
    return request(app)
      .post(`/api/reviews/not-an-id/comments`)
      .expect(400)
      .send(comment)
      .then((postRequest) => {
        expect(postRequest.body.msg).toBe("Invalid request");
      });
  });
  test("should respond with a status 400 when missing required fields, e.g. no username or body properties passed", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .expect(400)
      .send({}) //can have one or none
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("PATCH - status 200, responds with successfully updated review object", () => {
    const infoToUpdate = { inc_votes: 15 };
    return request(app)
      .patch("/api/reviews/1")
      .send(infoToUpdate)
      .expect(200)
      .then((response) => {
        const updatedReview = response.body.review;
        expect(updatedReview.votes).toBe(16);
      });
  });
  test("PATCH - status 200 - responds with successfully updated review object if additional property passed except of necessary one, additional property has to be ignored", () => {
    const infoToUpdate = { inc_votes: 15, title: "Something" };
    return request(app)
      .patch("/api/reviews/1")
      .send(infoToUpdate)
      .expect(200)
      .then((response) => {
        const updatedReview = response.body.review;
        expect(updatedReview.votes).toBe(16);
        expect(updatedReview.title).toBe("Agricola");
      });
  });
  test("PATCH - status 400 - responds with error message when required update field is missing", () => {
    const infoToUpdate = {};
    return request(app)
      .patch("/api/reviews/1")
      .send(infoToUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid request");
      });
  });
  test("PATCH - status 400 - responds with error message when update field has incorrect type", () => {
    const infoToUpdate = { inc_votes: "15" };
    return request(app)
      .patch("/api/reviews/1")
      .send(infoToUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid request");
      });
  });
  // test("PATCH - status 404, responds with error message when object with passed review number doesn't exist", () => {
  //   const infoToUpdate = { inc_votes: 15 };
  //   const review_id = 88888;
  //   return request(app)
  //     .patch(`/api/reviews/${review_id}`)
  //     .send(infoToUpdate)
  //     .expect(404)
  //     .then((response) => {
  //       expect(response.body.msg).toBe("Not found");
  //     });
  // });
  test("PATCH - status 400, responds with error message when passed review number is invalid", () => {
    const infoToUpdate = { inc_votes: 15 };
    return request(app)
      .patch("/api/reviews/something")
      .send(infoToUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid request");
      });
  });
});
