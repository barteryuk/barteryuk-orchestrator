const { gql } = require("apollo-server");

const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String!
    hp: String!
    rating: Float!
    quota: Int!
    status: Boolean!
  }

  type Admin {
    _id: ID!
    email: String!
    password: String!
  }

  type BidderProduct {
    _id: ID
    title: String
    description: String
    value: Float
    userId: String
    photo: String
    category: String
  }

  type Product {
    _id: ID!
    title: String!
    description: String
    bidProductId: [BidderProduct]
    value: Float!
    userId: String
    photo: String!
    category: String
  }

  type ResponseProduct {
    message: String,
    result: Product
  }


  type ResponseUser {
    status: String!
    message: String!
    user: User
  }

  type ResponseAdmin {
    status: String!
    message: String!
    admin: Admin
  }

  type ResponseLogin {
    status: String!
    message: String!
    email: String!
    userId: ID!
    access_token: String!
  }

  type ResponseLoginAdmin {
    status: String!
    message: String!
    access_token: String!
  }

  type ResponseMail {
    status: String!
    message: String!
  }

  input InputUser {
    email: String!
    password: String!
    hp: String!
    rating: Int!
    quota: Int!
    status: Boolean!
  }

  input InputAdmin {
    email: String!
    password: String!
  }

  input InputFinalBidder {
    FinalBidderId: String!
    FinalBidderRating: Int!
  }

  type Query {
    users: [User]
    user(email: String!): ResponseUser
    admins: [Admin]
    admin(email: String!): ResponseAdmin
    products: [Product]
    product(productid: ID!): Product
    ownItems: [Product]
  }

  type Mutation {
    addUser(user: InputUser): ResponseUser
    updateUser(_id: ID!, user: InputUser): ResponseUser
    deleteUser(_id: ID!): ResponseUser
    login(email: String!, password: String!): ResponseLogin

    addAdmin(admin: InputAdmin): ResponseAdmin
    updateAdmin(_id: ID!, admin: InputAdmin): ResponseAdmin
    deleteAdmin(_id: ID!): ResponseAdmin
    loginAdmin(email: String!, password: String!): ResponseLoginAdmin

    updateRating(FinalBidder: InputFinalBidder): ResponseUser
    updateStatus(email: String!): ResponseUser

    sendMail(email: String!): ResponseMail

    uploadImage(filename: String!): String!

    addProduct(
      title: String!
      description: String
      value: Float!
      photopath: String!
      category: String!
    ): Product


    bidItem(
      itemId: ID!
      collateralId: ID!
    ): ResponseProduct

  }
`;

module.exports = typeDefs;
