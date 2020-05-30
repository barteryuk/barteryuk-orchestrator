const app = require("../../barteryuk-userService/app");
const request = require("supertest");

describe("User Service", () => {
  let dummyId = "";
  describe("Successful Create", () => {
    test("should return object with status 201 and one user", (done) => {
      request(app)
        .post("/users")
        .send({
          email: "userDummy@mail.com",
          password: "1",
          hp: "0812345678",
          rating: 5,
          quota: 2,
          status: false,
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          } else {
            dummyId = res.body._id;
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("email", "userDummy@mail.com");
            return done();
          }
        });
    });
  });
  describe("Successful FindAll", () => {
    test("should return array with status 200 and all users", (done) => {
      request(app)
        .get("/users")
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res.body).toEqual(expect.any(Array));
            return done();
          }
        });
    });
    describe("Successful FindByName", () => {
      test("should return object with status 200 and one user", (done) => {
        request(app)
          .get("/users/userDummy@mail.com")
          .end((err, res) => {
            if (err) {
              console.log(err);
              return done(err);
            } else {
              expect(res.status).toBe(200);
              expect(res.body).toEqual(expect.any(Array));
              return done();
            }
          });
      });
      describe("Failed Email Non Unique", () => {
        test("should return object with status 400", (done) => {
          request(app)
            .post("/users")
            .send({
              email: "userDummy@mail.com",
              password: "1",
              hp: "0812345678",
              rating: 5,
              quota: 2,
              status: false,
            })
            .end((err, res) => {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty(
                  "message",
                  "Database Validation: Email already exist"
                );
                return done();
              }
            });
        });
      });
      describe("Failed Email Not Filled", () => {
        test("should return object with status 400", (done) => {
          request(app)
            .post("/users")
            .send({ email: "", password: "1" })
            .end((err, res) => {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty(
                  "message",
                  "Database Validation: Email is required"
                );
                return done();
              }
            });
        });
      });
      describe("Failed Email Field Does Not Exist", () => {
        test("should return object with status 400", (done) => {
          request(app)
            .post("/users")
            .send({ password: "1" })
            .end((err, res) => {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty(
                  "message",
                  "Database Validation: Email is required"
                );
                return done();
              }
            });
        });
      });
      describe("Failed Email type is not a@a.a", () => {
        test("should return object with status 400", (done) => {
          request(app)
            .post("/users")
            .send({ email: "a", password: "1" })
            .end((err, res) => {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty(
                  "message",
                  "Database Validation: a is not a valid email"
                );
                return done();
              }
            });
        });
      });
      describe("Failed Password Field Does Not Exist", () => {
        test("should return empty object with status 500", (done) => {
          request(app)
            .post("/users")
            .send({ email: "userDummy2@mail.com" })
            .end((err, res) => {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                expect(res.status).toBe(500);
                return done();
              }
            });
        });
      });
      describe("Failed Hp Field Does Not Exist", () => {
        test("should return object with status 400", (done) => {
          request(app)
            .post("/users")
            .send({
              email: "userDummy@mail.com",
              password: "1",
              hp: "",
              rating: 5,
              quota: 2,
              status: false,
            })
            .end((err, res) => {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty(
                  "message",
                  "Database Validation: Hp is required"
                );
                return done();
              }
            });
        });
      });
      describe("Successful Update", () => {
        test("should return object with status 200 and one user", (done) => {
          request(app)
            .put("/users/" + dummyId)
            .send({ email: "userDummy@mail.com", password: "2" })
            .end((err, res) => {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                expect(res.status).toBe(200);
                return done();
              }
            });
        });
      });
      describe("Successful Delete", () => {
        test("should return object with status 200 and one user", (done) => {
          request(app)
            .delete("/users/" + dummyId)
            .end((err, res) => {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                expect(res.status).toBe(200);
                return done();
              }
            });
        });
      });
    });
  });
});
