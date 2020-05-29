const { constructTestServer } = require("./__utils");
const { createTestClient } = require("apollo-server-testing");
const { gql } = require("apollo-server");
const { mockAdminResponse } = require("./admin");

const findAllAdmin = gql`
  query findAllAdmin {
    admins {
      _id
      email
      password
    }
  }
`;

const findByNameAdmin = gql`
  query findByNameAdmin {
    admin(email: "admin@mail.com") {
      status
      message
      admin {
        _id
        email
        password
      }
    }
  }
`;

const addAdmin = gql`
  mutation addAdmin {
    addAdmin(admin: { email: "admin@mail.com", password: "superadmin" }) {
      status
      message
      admin {
        _id
        email
        password
      }
    }
  }
`;

const loginAdmin = gql`
  mutation loginAdmin {
    loginAdmin(email: "admin2@mail.com", password: "superadmin") {
      status
      message
      access_token
    }
  }
`;

describe("Test Admin", () => {
  const { server, adminAPI } = constructTestServer();

  adminAPI.get = jest.fn(() => [mockAdminResponse]);

  const { query, mutate } = createTestClient(server);

  describe("Queries", () => {
    it("fetches list of admins", async () => {
      const res = await query({ query: findAllAdmin });
      expect(res.data.admins).toEqual(expect.any(Array));
    });

    // it("fetches single admin", async () => {
    //   const res = await query({ query: findByNameAdmin });
    //   console.log(res);
    //   expect(res.data.admins).toHaveProperty("status", 200);
    // });
  });

  // describe("Mutations", () => {
  //   it("returns login token", async () => {
  //     const res = await mutate({
  //       mutation: loginAdmin,
  //     });
  //     console.log(res);
  //     expect(res).toHaveProperty("access_token");
  //   });
  // });
});
