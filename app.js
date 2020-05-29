if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen(PORT)
  .then(({ url }) => console.log("Apollo Server ready at: ", url))
  .catch((err) => console.log("Apollo server not connected ", err));
