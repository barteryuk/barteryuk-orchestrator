require("dotenv").config();
const expect = require("chai").expect;
const adminApi = require("../datasources/admin");
const Redis = require("ioredis");
const redis = new Redis();
let dummyId = "";
let dummyId2 = "";

describe("ADMIN", () => {
  describe("MUTATION - addAdmin(admin: InputAdmin): ResponseAdmin", () => {
    it("SUCCESSFUL - Server returns status 201 and created an admin", async () => {
      const result = await adminApi.create("", {
        admin: {
          email: "adminDummy@mail.com",
          password: "1",
        },
      });
      dummyId = result.admin._id;
      redis.del("admins");
      expect(result).to.have.property("status", 201);
      expect(result).to.have.property(
        "message",
        "Orchestrator successfully created data to adminService"
      );
    });
    it("SUCCESSFUL - Redis returns status 201 and created an admin", async () => {
      const result = await adminApi.create("", {
        admin: {
          email: "adminDummy2@mail.com",
          password: "1",
        },
      });
      dummyId2 = result.admin._id;
      redis.del("admins");
      expect(result).to.have.property("status", 201);
      expect(result).to.have.property(
        "message",
        "Orchestrator successfully created data to adminService"
      );
    });
    it("FAILED - Server returns status 400 when email already exist", async () => {
      const result = await adminApi.create("", {
        admin: {
          email: "adminDummy@mail.com",
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
  describe("Query - admins: [Admin]", () => {
    it("SUCCESSFUL - Server returns all when admin can be found", async () => {
      const result = await adminApi.findAll();
      expect(result).to.be.an("array");
    });
    it("SUCCESSFUL - Redis returns all when admin can be found", async () => {
      const result = await adminApi.findAll();
      expect(result).to.be.an("array");
    });
  });
  describe("Query - admin: Admin", () => {
    it("SUCCESSFUL - Server returns status 200 when admin can be found", async () => {
      const result = await adminApi.findByName(
        "",
        { email: "adminDummy@mail.com" },
        "",
        ""
      );
      redis.del("admins");
      expect(result).to.have.property("status", 200);
      expect(result).to.have.property("message", "Admin Found");
    });
    it("SUCCESSFUL - Redis returns status 200 when admin can be found", async () => {
      const result = await adminApi.findByName(
        "",
        { email: "adminDummy@mail.com" },
        "",
        ""
      );
      expect(result).to.have.property("status", 200);
      expect(result).to.have.property("message", "Admin Found");
    });
    it("FAILED - Server returns status 400 when admin cannot be found", async () => {
      const result = await adminApi.findByName(
        "",
        { email: "admin0@mail.com" },
        "",
        ""
      );
      expect(result).to.have.property("status", 404);
      expect(result).to.have.property(
        "message",
        "Orchestrator Validation: Admin not found"
      );
    });
  });
  describe("MUTATION - loginAdmin(email: String!, password: String!): ResponseLoginAdmin", () => {
    it("SUCCESSFUL - Server returns status 200 and return access token", async () => {
      const result = await adminApi.login("", {
        email: "adminDummy@mail.com",
        password: "1",
      });
      expect(result).to.have.property("status", 200);
      expect(result).to.have.property(
        "message",
        "Orchestrator successfully logged in admin to adminService"
      );
    });
    it("FAILED - Server returns status 400 when password wrong", async () => {
      const result = await adminApi.login("", {
        email: "adminDummy@mail.com",
        password: "2",
      });
      expect(result).to.have.property("status", 400);
      expect(result).to.have.property(
        "message",
        "Database Validation: Invalid Admin / Password"
      );
    });
  });
  describe("MUTATION - updateAdmin(_id: ID!, admin: InputAdmin): ResponseAdmin", () => {
    it("SUCCESSFUL - Server returns status 200 and updated an admin", async () => {
      const result = await adminApi.put("", {
        _id: dummyId,
        admin: {
          email: "adminDummyUpdate@mail.com",
          password: "2",
        },
      });
      redis.del("admins");
      expect(result).to.have.property("status", 200);
      expect(result).to.have.property(
        "message",
        "Orchestrator successfully updated data to adminService"
      );
    });
    it("SUCCESSFUL - Redis returns status 200 and updated an admin", async () => {
      const result = await adminApi.put("", {
        _id: dummyId,
        admin: {
          email: "adminDummyUpdate@mail.com",
          password: "2",
        },
      });
      expect(result).to.have.property("status", 200);
      expect(result).to.have.property(
        "message",
        "Orchestrator successfully updated data to adminService"
      );
    });
    it("FAILED - Server returns status 404 when admin not found", async () => {
      const result = await adminApi.put("", {
        _id: "5ed64a45441ae05c6260ff22",
        admin: {
          email: "adminDummyUpdate@mail.com",
          password: "2",
        },
      });
      expect(result).to.have.property("status", 404);
      expect(result).to.have.property(
        "message",
        "Orchestrator Validation: Admin not found"
      );
    });
    it("FAILED - Server returns status 400 when admin already exist", async () => {
      const result = await adminApi.put("", {
        _id: dummyId2,
        admin: {
          email: "adminDummyUpdate@mail.com",
          password: "1",
        },
      });
      expect(result).to.have.property("status", 400);
      expect(result).to.have.property(
        "message",
        "Database Validation: Email already exist"
      );
    });
    describe("MUTATION - deleteAdmin(_id: ID!): ResponseAdmin", () => {
      it("SUCCESSFUL - Server returns status 200 and deleted an admin", async () => {
        const result = await adminApi.delete("", { _id: dummyId });
        redis.del("admins");
        expect(result).to.have.property("status", 200);
        expect(result).to.have.property(
          "message",
          "Orchestrator successfully deleted data from adminService"
        );
      });
      it("SUCCESSFUL - Redis returns status 200 and deleted an admin", async () => {
        const result = await adminApi.delete("", { _id: dummyId2 });
        expect(result).to.have.property("status", 200);
        expect(result).to.have.property(
          "message",
          "Orchestrator successfully deleted data from adminService"
        );
      });
      it("FAILED - Server returns status 404 when admin not found", async () => {
        const result = await adminApi.delete("", { _id: dummyId });
        expect(result).to.have.property("status", 404);
        expect(result).to.have.property(
          "message",
          "Orchestrator Validation: Admin not found"
        );
      });
      it("FAILED - Server returns error when admin _id not found", async () => {
        const result = await adminApi.delete("", { id: dummyId2 });
        expect(result).to.have.property("status", undefined);
      });
    });
  });
});
