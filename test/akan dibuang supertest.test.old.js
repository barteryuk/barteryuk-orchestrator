const app = require("../app");
// const request = require("supertest");
console.log(app);
const { gql } = require("apollo-server");
const url = "http://localhost:4000";
const request = require("supertest")(url);

const findAllAdmin = gql`
  query findAllAdmin {
    admins {
      _id
      email
      password
    }
  }
`;

describe("Admin Service", () => {
  describe("GET /admins", () => {
    describe("Successful FindAll", () => {
      test("should return object with status 200 and all users", (done) => {
        request
          .get("/")
          .send({ query: findAllAdmin })
          .end((err, res) => {
            if (err) {
              console.log(err);
              return done(err);
            } else {
              console.log(res.body);
              expect(res.status).toBe(200);
              expect(res.body.result).toEqual(expect.any(Array));
              return done();
            }
          });
      });
    });
  });
});
