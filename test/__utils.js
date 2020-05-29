const { HttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const { execute, toPromise } = require("apollo-link");

module.exports.toPromise = toPromise;

const { ApolloServer } = require("apollo-server");
const typeDefs = require("../schema/typeDefs");
const resolvers = require("../schema/resolvers");
const UserAPI = require("../datasources/user");
const AdminAPI = require("../datasources/admin");

const constructTestServer = () => {
  const userAPI = new UserAPI();
  const adminAPI = new AdminAPI();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  return { server, userAPI, adminAPI };
};

module.exports.constructTestServer = constructTestServer;

const startTestServer = async (server) => {
  const httpServer = await server.listen({ port: 4000 });

  const link = new HttpLink({
    uri: `http://localhost:${httpServer.port}/`,
    fetch,
  });

  const executeOperation = ({ query, variables = {} }) =>
    execute(link, { query, variables });

  return {
    link,
    stop: () => httpServer.server.close(),
    graphql: executeOperation,
  };
};

module.exports.startTestServer = startTestServer;
