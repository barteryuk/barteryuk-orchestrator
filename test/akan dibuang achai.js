const { gql } = require("apollo-server");

const chai = require("chai"),
  chaiHttp = require("chai-http");

chai.use(chaiHttp);

const findAllAdmin = gql`
  query findAllAdmin {
    admins {
      _id
      email
      password
    }
  }
`;

describe("ADMIN TEST CHAI", () => {
  it("Success findAll", (done) => {
    chai
      .request(app)
      .get("/")
      .send(findAllAdmin)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
