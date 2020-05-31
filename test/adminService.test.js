const app = require("../../barteryuk-adminService/app");
const request = require("supertest");

describe("Admin Service", () => {
  let dummyId = "";
  describe("Connected to adminService", () => {
    test("should return text with status 200", (done) => {
      request(app)
        .get("/")
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res).toHaveProperty("text", "welcome to adminService");
            return done();
          }
        });
    });
  });
  describe("Successful Create", () => {
    test("should return object with status 201 and one user", (done) => {
      request(app)
        .post("/admins")
        .send({ email: "adminDummy@mail.com", password: "1" })
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          } else {
            dummyId = res.body._id;
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("email", "adminDummy@mail.com");
            return done();
          }
        });
    });
  });
  describe("Successful FindAll", () => {
    test("should return array with status 200 and all users", (done) => {
      request(app)
        .get("/admins")
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
          .get("/admins/adminDummy@mail.com")
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
      describe("Failed Non Unique", () => {
        test("should return object with status 400", (done) => {
          request(app)
            .post("/admins")
            .send({ email: "adminDummy@mail.com", password: "1" })
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
            .post("/admins")
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
            .post("/admins")
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
      describe("Failed Password Field Does Not Exist", () => {
        test("should return empty object with status 500", (done) => {
          request(app)
            .post("/admins")
            .send({ email: "adminDummy2@mail.com", password: null })
            .end((err, res) => {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                console.log(res.body);
                expect(res.status).toBe(500);
                return done();
              }
            });
        });
      });
      describe("Failed Email type is not a@a.a", () => {
        test("should return object with status 400", (done) => {
          request(app)
            .post("/admins")
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
      describe("Successful Update", () => {
        test("should return object with status 200 and one user", (done) => {
          request(app)
            .put("/admins/" + dummyId)
            .send({ email: "adminDummy@mail.com", password: "2" })
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
            .delete("/admins/" + dummyId)
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
