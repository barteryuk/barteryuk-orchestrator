require("dotenv").config();
const expect = require("chai").expect;
const userApi = require("../datasources/user");
const Redis = require("ioredis");
const redis = new Redis();
let dummyId = "";
let dummyId2 = "";

describe("USER", () => {
  describe("MUTATION - addUser(user: InputUser): ResponseUser", () => {
    it("SUCCESSFUL - Server returns status 201 and created a user", async () => {
      const result = await userApi.create("", {
        user: {
          email: "userDummy@mail.com",
          password: "1",
          hp: "0812345678",
          rating: 5,
          quota: 2,
          status: false,
        },
      });
      dummyId = result.user._id;
      redis.del("users");
      expect(result).to.have.property("status", 201);
      expect(result).to.have.property(
        "message",
        "Orchestrator successfully created data to userService"
      );
    });
  });
  it("SUCCESSFUL - Redis returns status 201 and created a user", async () => {
    const result = await userApi.create("", {
      user: {
        email: "userDummy2@mail.com",
        password: "1",
        hp: "0812345678",
        rating: 5,
        quota: 2,
        status: false,
      },
    });
    dummyId2 = result.user._id;
    redis.del("users");
    expect(result).to.have.property("status", 201);
    expect(result).to.have.property(
      "message",
      "Orchestrator successfully created data to userService"
    );
  });
  it("FAILED - Server returns status 400 when email already exist", async () => {
    const result = await userApi.create("", {
      user: {
        email: "userDummy@mail.com",
        password: "1",
        rating: 5,
        quota: 2,
        status: false,
      },
    });
    expect(result).to.have.property("status", 400);
    expect(result).to.have.property(
      "message",
      "Database Validation: Hp is required"
    );
  });
});
describe("Query - users: [User]", () => {
  it("SUCCESSFUL - Server returns all when user can be found", async () => {
    const result = await userApi.findAll();
    expect(result).to.be.an("array");
  });
  it("SUCCESSFUL - Redis returns all when user can be found", async () => {
    const result = await userApi.findAll();
    expect(result).to.be.an("array");
  });
});
describe("Query - user: User", () => {
  it("SUCCESSFUL - Server returns status 200 when user can be found", async () => {
    const result = await userApi.findByName(
      "",
      { email: "userDummy@mail.com" },
      "",
      ""
    );
    redis.del("users");
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property("message", "User Found");
  });
  it("SUCCESSFUL - Redis returns status 200 when user can be found", async () => {
    const result = await userApi.findByName(
      "",
      { email: "userDummy@mail.com" },
      "",
      ""
    );
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property("message", "User Found");
  });
  it("FAILED - Server returns status 400 when user cannot be found", async () => {
    const result = await userApi.findByName(
      "",
      { email: "user0@mail.com" },
      "",
      ""
    );
    expect(result).to.have.property("status", 404);
    expect(result).to.have.property(
      "message",
      "Orchestrator Validation: User not found"
    );
  });
});
describe("Query - userById(userId: String!): ResponseUser", () => {
  it("SUCCESSFUL - Server returns status 200 when user can be found", async () => {
    const result = await userApi.findById("", { userId: dummyId }, "", "");
    redis.del("users");
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property("message", "User Found");
  });
  it("SUCCESSFUL - Redis returns status 200 when user can be found", async () => {
    const result = await userApi.findById("", { userId: dummyId2 }, "", "");
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property("message", "User Found");
  });
  it("FAILED - Server returns status 400 when user cannot be found", async () => {
    const result = await userApi.findById(
      "",
      { id: "5ed11135cd53402082d01b04" },
      "",
      ""
    );
    expect(result).to.have.property("status", 404);
    expect(result).to.have.property(
      "message",
      "Orchestrator Validation: User not found"
    );
  });
});
describe("MUTATION - loginUser(email: String!, password: String!): ResponseLoginUser", () => {
  it("SUCCESSFUL - Server returns status 200 and return access token", async () => {
    const result = await userApi.login("", {
      email: "userDummy@mail.com",
      password: "1",
    });
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property(
      "message",
      "Orchestrator successfully logged in user to userService"
    );
  });
  it("FAILED - Server returns status 400 when password wrong", async () => {
    const result = await userApi.login("", {
      email: "userDummy@mail.com",
      password: "2",
    });
    expect(result).to.have.property("status", 400);
    expect(result).to.have.property(
      "message",
      "Database Validation: Invalid Username / Password"
    );
  });
});
describe("MUTATION - updateStatus(email: String!): ResponseUser", () => {
  it("SUCCESSFUL - Server returns status 200 and a user", async () => {
    const result = await userApi.updateStatus("", {
      email: "userDummy@mail.com",
    });
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property(
      "message",
      "Orchestrator successfully updated status to userService"
    );
  });
  it("SUCCESSFUL - Server returns status 200 and a user", async () => {
    const result = await userApi.updateStatus();
    expect(result).to.have.property("status", 500);
    expect(result).to.have.property("message", "Internal Server Error");
  });
});

describe("MUTATION - updateRating(FinalBidderId: String!, FinalBidderRating: Int!): ResponseUser", () => {
  it("SUCCESSFUL - Server returns status 200 and a user", async () => {
    const result = await userApi.updateRating("", {
      FinalBidderId: dummyId,
      FinalBidderRating: 5,
    });
    redis.del("users");
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property(
      "message",
      "Orchestrator successfully updated rating to userService"
    );
  });
  it("SUCCESSFUL - Redis returns status 200 and a user", async () => {
    const result = await userApi.updateRating("", {
      FinalBidderId: dummyId2,
      FinalBidderRating: 5,
    });
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property(
      "message",
      "Orchestrator successfully updated rating to userService"
    );
  });
});
it("FAILED - Server returns status 404 when user cannot be found", async () => {
  const result = await userApi.updateRating("", {
    FinalBidderId: "5ed11135cd53402082d01b04",
    FinalBidderRating: 5,
  });
  expect(result).to.have.property("status", 404);
  expect(result).to.have.property(
    "message",
    "Orchestrator Validation: User not found"
  );
});

it("FAILED - Server returns status 500 when FinalBidderId is not found", async () => {
  const result = await userApi.updateRating();
  expect(result).to.have.property("status", 500);
  expect(result).to.have.property("message", "Internal Server Error");
});
describe("MUTATION - updateUser(_id: ID!, user: InputUser): ResponseUser", () => {
  it("SUCCESSFUL - Server returns status 200 and updated an user", async () => {
    const result = await userApi.put("", {
      _id: dummyId,
      user: {
        email: "userDummyUpdate@mail.com",
        password: "2",
      },
    });
    redis.del("users");
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property(
      "message",
      "Orchestrator successfully updated data to userService"
    );
  });
  it("SUCCESSFUL - Redis returns status 200 and updated an user", async () => {
    const result = await userApi.put("", {
      _id: dummyId,
      user: {
        email: "userDummyUpdate@mail.com",
        password: "2",
      },
    });
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property(
      "message",
      "Orchestrator successfully updated data to userService"
    );
  });
  it("FAILED - Server returns status 404 when user not found", async () => {
    const result = await userApi.put("", {
      _id: "5ed64a45441ae05c6260ff22",
      user: {
        email: "userDummyUpdate@mail.com",
        password: "2",
      },
    });
    expect(result).to.have.property("status", 404);
    expect(result).to.have.property(
      "message",
      "Orchestrator Validation: User not found"
    );
  });
  it("FAILED - Server returns status 400 when user already exist", async () => {
    const result = await userApi.put("", {
      _id: dummyId2,
      user: {
        email: "userDummyUpdate@mail.com",
        password: "1",
      },
    });
    expect(result).to.have.property("status", 400);
    expect(result).to.have.property(
      "message",
      "Database Validation: Email already exist"
    );
  });
});
describe("MUTATION - deleteUser(_id: ID!): ResponseUser", () => {
  it("SUCCESSFUL - Server returns status 200 and deleted a user", async () => {
    const result = await userApi.delete("", { _id: dummyId });
    redis.del("users");
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property(
      "message",
      "Orchestrator successfully deleted data from userService"
    );
  });
  it("SUCCESSFUL - Redis returns status 200 and deleted a user", async () => {
    const result = await userApi.delete("", { _id: dummyId2 });
    redis.del("users");
    expect(result).to.have.property("status", 200);
    expect(result).to.have.property(
      "message",
      "Orchestrator successfully deleted data from userService"
    );
  });
  it("FAILED - Server returns status 404 when user not found", async () => {
    const result = await userApi.delete("", { _id: dummyId });
    expect(result).to.have.property("status", 404);
    expect(result).to.have.property(
      "message",
      "Orchestrator Validation: User not found"
    );
  });
  it("FAILED - Server returns error when user _id not found", async () => {
    const result = await userApi.delete("", { id: dummyId2 });
    expect(result).to.have.property("status", 500);
  });
});
