const AdminAPI = require("../datasources/admin");

// const mocks = {
//   get: jest.fn(),
// };

// const ds = new AdminAPI();
// ds.findAll = mocks.get;

// describe("[AdminAPI.findAll]", () => {
//   it("looks up admins from api", async () => {
//     // mocks.get.mockReturnValueOnce([mockAdminResponse]);
//     const res = await AdminAPI.findAll();
//     expect(res).toEqual(expect.any(Array));
//   });
// });

// describe("[AdminAPI.findByName]", () => {
//   it("should look up single admin from api", async () => {
//     // ds.findByName = jest.fn("", { email: "admin2@mail.com" }, "", "");

//     // mocks.getFindByName.mockReturnValueOnce([mockAdminResponse]);
//     const res = await AdminAPI.findByName(
//       1,
//       { email: "admin2@mail.com" },
//       3,
//       4
//     );
//     console.log(res);
//     expect(res).toEqual(mockAdmin);
//   });
// });

const mockAdmin = {
  _id: "5ed11135cd53402082d01b04",
  email: "admin2@mail.com",
  password: "$2a$10$HajlFmWjIhaZrOTYB8sLtuo/cPYPoYXM0zS/3sG/mH26jQ3FfXIHS",
};

const mockAdminResponse = {
  status: "201",
  message: "Orchestrator successfully created data to adminService",
  admin: {
    _id: "5ed13034cd53402082d01b06",
    email: "admin@mail.com",
    password: "$2a$10$E6xZnS9TvssIXOWUgZZW5uQPIz4QF5hg.HmgoUwtZa8ygt/jsQuSe",
  },
};

module.exports.mockAdminResponse = mockAdminResponse;
