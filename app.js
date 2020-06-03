if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer, AuthenticationError } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const jwt = require("jsonwebtoken");
const resolvers = require("./schema/resolvers");
// const PORT = process.env.PORT || 4000;
const PORT = process.env.PORT || 4000;

// USE CONTEXT
const context = ({ req }) => {
  const token = req.headers.access_token || "";
  // console.log("WHAT IS TOKEN?")
  // console.log(token)
  return { token: token };
  // try {
  //   jwt.verify(token, process.env.SECRET)
  // }
  // catch (e) {
  //   throw new AuthenticationError(
  //       'Authentication token is invalid, please log in'
  //   )
  // }
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

if (process.env.NODE_ENV === "test") {
  const app = () =>
    server
      .listen(PORT)
      .then(({ url }) => console.log("Apollo Server ready at: ", url))
      .catch((err) => console.log("Apollo server not connected ", err));
  module.exports = app;
} else {
  server
    .listen(PORT)
    .then(({ url }) => console.log("Apollo Server ready at: ", url))
    .catch((err) => console.log("Apollo server not connected ", err));
}
