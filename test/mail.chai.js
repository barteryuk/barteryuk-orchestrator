require("dotenv").config();
const expect = require("chai").expect;
const mailApi = require("../datasources/mail");
const userApi = require("../datasources/user");
const Redis = require("ioredis");
const redis = new Redis();
let dummyId = "";

before(async () => {
  const result = await userApi.create("", {
    user: {
      email: "userMailDummy@mail.com",
      password: "1",
      hp: "0812345678",
      rating: 5,
      quota: 2,
      status: false,
    },
  });
  dummyId = result.user._id;
  redis.del("users");
});

after(async () => {
  const result = await userApi.delete("", { _id: dummyId });
  redis.del("users");
});

describe("MAIL", () => {
  describe("MUTATION - sendMail(id: ID!): ResponseMail", () => {
    it("SUCCESSFUL - Server returns status 200 and send an email", async () => {
      const result = await mailApi.sendMail("", {
        id: "5ed0df68df5f9a155b597de4",
      });
      expect(result).to.have.property("status", 200);
      expect(result).to.have.property("message", "Email sent to: b@mail.com");
    });
    it("FAILED - Server returns status 400 and send an email", async () => {
      const result = await mailApi.sendMail("", {
        id: "a",
      });
      expect(result).to.have.property("status", undefined);
      expect(result).to.have.property("message", undefined);
    });
  });
});
