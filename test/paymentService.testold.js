const app = require("../../barteryuk-paymentService/app");
const request = require("supertest");

describe("Payment Service", () => {
  describe("Connected to paymentService", () => {
    test("should return text with status 200", (done) => {
      request(app)
        .get("/")
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res).toHaveProperty("text", "welcome to paymentService");
            return done();
          }
        });
    });
  });

  describe("Successful FindAll", () => {
    test("should return array with status 200 and all payments", (done) => {
      request(app)
        .get("/payments")
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          } else {
            console.log(res.body);
            expect(res.status).toBe(200);
            expect(res.body).toEqual(expect.any(Array));
            return done();
          }
        });
    });
  });
});
