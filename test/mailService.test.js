const app = require("../../barteryuk-mailService/app");
const request = require("supertest");

describe("Mail Service", () => {
  describe("Connected to mailService", () => {
    test("should return text with status 200", (done) => {
      request(app)
        .get("/")
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res).toHaveProperty("text", "welcome to mailService");
            return done();
          }
        });
    });
  });
  describe("Successful Send Mail", () => {
    test("should return message with status 200", (done) => {
      request(app)
        .post("/sendNewBid")
        .send({ email: "adminDummy@mail.com" })
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty(
              "message",
              "Email sent to: adminDummy@mail.com"
            );
            return done();
          }
        });
    });
  });
  describe("Failed Send Mail", () => {
    test("should return message with status 500", (done) => {
      request(app)
        .post("/sendNewBid")
        .send({ email: "adminDummy" })
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          } else {
            console.log(res.body);
            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty(
              "message",
              "Failed sending email to: adminDummy"
            );
            return done();
          }
        });
    });
  });
});
