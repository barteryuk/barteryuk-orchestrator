require("dotenv").config();
const expect = require("chai").expect;
const paymentApi = require("../datasources/payment");
const Redis = require("ioredis");
const redis = new Redis();
let dummyId = "";

let dummyId2 = "";

describe("PAYMENT", () => {
  describe("MUTATION - addPayment(payment: InputPayment): ResponsePayment", () => {
    it("SUCCESSFUL - Server returns status 201 and created a payment", async () => {
      const result = await paymentApi.create("", {
        email: "paymentDummy@mail.com",
        topUp: 5,
      });
      dummyId = result.payment._id;
      redis.del("payments");
      console.log(result);
      expect(result).to.have.property("status", 201);
    });
  });
  it("SUCCESSFUL - Redis returns status 201 and created a payment", async () => {
    const result = await paymentApi.create("", {
      email: "paymentDummy@mail.com",
      topUp: 5,
    });
    dummyId2 = result.payment._id;
    redis.del("payments");
    expect(result).to.have.property("status", 201);
  });
  it("FAILED - Server returns status 400 when email already exist", async () => {
    const result = await paymentApi.create();
    expect(result).to.have.property("status", 400);
    expect(result).to.have.property(
      "message",
      "Database Validation: Hp is required"
    );
  });
});
