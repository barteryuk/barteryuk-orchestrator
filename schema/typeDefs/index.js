const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    password: String!
    hp: String!
    rating: Int!
    quota: Int!
    status: Boolean!
  }

  type ResponseUser {
    status: String!
    message: String!
    user: User
  }

  type ResponseLogin {
    status: String!
    message: String!
    access_token: String!
  }

  input InputUser {
    email: String!
    password: String!
    hp: String!
    rating: Int!
    quota: Int!
    status: Boolean!
  }

  type Query {
    users: [User]
    user(email: String!): ResponseUser
  }

  type Mutation {
    addUser(user: InputUser): ResponseUser
    updateUser(_id: ID!, user: InputUser): ResponseUser
    deleteUser(_id: ID!): ResponseUser
    login(email: String!, password: String!): ResponseLogin
  }
`;

module.exports = typeDefs;
