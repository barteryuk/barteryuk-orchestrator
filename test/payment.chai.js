require("dotenv").config();
const expect = require("chai").expect;
const paymentApi = require("../datasources/payment");
const userApi = require("../datasources/user");
const Redis = require("ioredis");
const redis = new Redis();
let dummyId = "";
let dummyId2 = "";
let dummyUserId = "";

before(async () => {
  const result = await userApi.create("", {
    user: {
      email: "paymentDummy@mail.com",
      password: "1",
      hp: "0812345678",
      rating: 5,
      quota: 2,
      status: false,
    },
  });
  dummyUserId = result.user._id;
  redis.del("users");
});

after(async () => {
  const result = await userApi.delete("", { _id: dummyUserId });
  redis.del("users");
});

describe("PAYMENT", () => {
  describe("MUTATION - addPayment(email: String!, topUp: Int!): ResponsePayment", () => {
    it("SUCCESSFUL - Server returns status 201 and created a payment", async () => {
      redis.del("payments");
      const result = await paymentApi.create("", {
        email: "paymentDummy@mail.com",
        topUp: 5,
      });
      dummyId = result.payment.id;
      expect(result).to.have.property("status", 201);
    });
  });
  it("SUCCESSFUL - Redis returns status 201 and created a payment", async () => {
    const result = await paymentApi.create("", {
      email: "paymentDummy@mail.com",
      topUp: 5,
    });
    dummyId2 = result.payment.id;
    redis.del("payments");
    expect(result).to.have.property("status", 201);
  });
  it("FAILED - Server returns status 400 when email already exist", async () => {
    const result = await paymentApi.create();
    expect(result).to.have.property("status", 500);
    expect(result).to.have.property("message", "Internal Server Error");
  });
  describe("Query - payments: [Payment]", () => {
    it("SUCCESSFUL - Server returns all when payment can be found", async () => {
      const result = await paymentApi.findAll();
      redis.del("payments");
      expect(result).to.be.an("array");
    });
    it("SUCCESSFUL - Redis returns all when payment can be found", async () => {
      const result = await paymentApi.findAll();
      expect(result).to.be.an("array");
    });
  });
  describe("Query - updatePayment(id: ID!, status: String!): ResponsePayment", () => {
    it("SUCCESSFUL - Server returns 200 and update payment", async () => {
      const result = await paymentApi.put("", {
        id: dummyId,
        status: "accept",
      });
      expect(result).to.have.property("status", 200);
    });
    it("FAILED - Server returns 400 because status is not pending", async () => {
      const result = await paymentApi.put("", {
        id: dummyId,
        status: "accept",
      });
      expect(result).to.have.property("status", 400);
    });
    it("FAILED - Server returns 500 because server gives error", async () => {
      const result = await paymentApi.put("", {
        _id: dummyId,
      });
      expect(result).to.have.property("status", 500);
    });
  });
});
