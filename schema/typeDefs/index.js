const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    password: String!
  }

  type ResponseUser {
    status: String!
    message: String!
    token: String
    user: User
  }

  input InputUser {
    email: String!
    password: String!
  }

  type Query {
    users: [User]
    user(email: String!): ResponseUser
  }

  type Mutation {
    addUser(user: InputUser): ResponseUser
    updateUser(_id: ID!, user: InputUser): ResponseUser
    deleteUser(_id: ID!): ResponseUser
  }
`;

module.exports = typeDefs;
