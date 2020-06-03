const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();
const { ObjectId } = require("mongoose").Types;

const baseUrl = process.env.USERAPI;

class Controller {
  static async findAll() {
    try {
      const users = JSON.parse(await redis.get("users"));
      if (users) {
        return users;
      } else {
        const { data } = await axios({
          url: baseUrl,
          method: "GET",
        });
        redis.set("users", JSON.stringify(data));
        return data;
      }
    } catch (error) {
      return console.log("error : ", error);
    }
  }

  static async findByName(parent, args, context, info) {
    try {
      const { data } = await axios({
        url: baseUrl,
        method: "GET",
      });

      const users = JSON.parse(await redis.get("users"));
      if (users) {
        redis.del("users");
        redis.set("users", JSON.stringify(data));
      } else {
        redis.set("users", JSON.stringify(data));
      }

      const [filtered] = data.filter((el) => el.email === args.email);
      if (filtered !== undefined) {
        return {
          status: 200,
          message: "User Found",
          user: filtered,
        };
      } else {
        return {
          status: 404,
          message: "Orchestrator Validation: User not found",
          user: {
            _id: "not found",
            email: args.email,
            password: "not found",
            hp: "not found",
            rating: 0,
            quota: 0,
            status: true,
          },
        };
      }
    } catch (error) {
      return console.log("error : ", error);
    }
  }

  static async findById(parent, args, context, info) {
    try {
      const { data } = await axios({
        url: baseUrl,
        method: "GET",
      });

      const users = JSON.parse(await redis.get("users"));
      if (users) {
        redis.del("users");
        redis.set("users", JSON.stringify(data));
      } else {
        redis.set("users", JSON.stringify(data));
      }

      const [filtered] = data.filter((el) => String(el._id) == args.userId);
      if (filtered !== undefined) {
        return {
          status: 200,
          message: "User Found",
          user: filtered,
        };
      } else {
        return {
          status: 404,
          message: "Orchestrator Validation: User not found",
          user: {
            _id: "not found",
            email: args.email,
            password: "not found",
            hp: "not found",
            rating: 0,
            quota: 0,
            status: true,
          },
        };
      }
    } catch (error) {
      return console.log("error : ", error);
    }
  }

  static async create(_, args) {
    try {
      const result = await axios({
        url: baseUrl,
        method: "POST",
        data: {
          email: args.user.email,
          password: args.user.password,
          hp: args.user.hp,
          rating: 5,
          quota: 2,
          status: false,
        },
      });
      const { data } = result;
      if (!data.errors) {
        const users = JSON.parse(await redis.get("users"));
        if (users) {
          users.push(data);
          redis.del("users");
          redis.set("users", JSON.stringify(users));
        } else {
          const { data: dataGet } = await axios({
            url: baseUrl,
            method: "GET",
          });
          redis.set("users", JSON.stringify(dataGet));
        }
      }

      return {
        status: 201,
        message: "Orchestrator successfully created data to userService",
        user: data,
      };
    } catch (error) {
      return {
        status: error.response.data.status,
        message: error.response.data.message,
        user: {
          _id: "not found",
          ...args.user,
        },
      };
    }
  }

  static async put(_, args) {
    try {
      const { data } = await axios({
        url: baseUrl + args._id,
        method: "PUT",
        data: args.user,
      });

      const users = JSON.parse(await redis.get("users"));
      if (users) {
        const notFiltered = users.filter((el) => el._id !== args._id);
        const [filtered] = users.filter((el) => el._id === args._id);

        if (filtered !== undefined) {
          filtered.email = args.user.email || null;
          filtered.password = args.user.password || null;
          filtered.hp = args.user.hp || null;
          filtered.rating = args.user.rating || null;
          filtered.quota = args.user.quota || null;
          filtered.status = args.user.status || null;
          notFiltered.push(filtered);
          redis.del("users");
          redis.set("users", JSON.stringify(notFiltered));
        }
      } else {
        const { data: dataGet } = await axios({
          url: baseUrl,
          method: "GET",
        });
        redis.set("users", JSON.stringify(dataGet));
      }
      if (data === null) {
        return {
          status: 404,
          message: "Orchestrator Validation: User not found",
        };
      } else {
        return {
          status: 200,
          message: "Orchestrator successfully updated data to userService",
          user: data,
        };
      }
    } catch (error) {
      return {
        status: error.response.data.status,
        message: error.response.data.message,
        user: {
          _id: "not found",
          ...args.user,
        },
      };
    }
  }

  static async delete(_, args) {
    try {
      const { data } = await axios({
        url: baseUrl + args._id,
        method: "DELETE",
      });
      const users = JSON.parse(await redis.get("users"));
      if (users) {
        const notFiltered = users.filter((el) => el._id !== args._id);
        redis.del("users");
        redis.set("users", JSON.stringify(notFiltered));
      } else {
        const { data: dataGet } = await axios({
          url: baseUrl,
          method: "GET",
        });
        redis.set("users", JSON.stringify(dataGet));
      }
      if (data === null) {
        return {
          status: 404,
          message: "Orchestrator Validation: User not found",
        };
      } else {
        return {
          status: 200,
          message: "Orchestrator successfully deleted data from userService",
          user: data,
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  }

  static async login(_, args) {
    try {
      const result = await axios({
        url: baseUrl + "login",
        method: "POST",
        data: {
          email: args.email,
          password: args.password,
        },
      });
      const { data } = result;

      return {
        status: 200,
        message: "Orchestrator successfully logged in user to userService",
        email: data.email,
        userId: data.userId,
        access_token: data.access_token,
      };
    } catch (error) {
      return {
        status: error.response.data.status,
        message: error.response.data.message,
        access_token: "not found",
      };
    }
  }

  static async updateRating(_, args) {
    try {
      const { data: dataToUpdate } = await axios({
        url: baseUrl,
        method: "GET",
      });

      const [filteredToUpdate] = dataToUpdate.filter(
        (el) => el._id === args.FinalBidderId
      );
      if (filteredToUpdate) {
        filteredToUpdate.rating = (
          (args.FinalBidderRating + filteredToUpdate.rating) /
          2
        ).toFixed(1);

        const { data } = await axios({
          url: baseUrl + args.FinalBidderId,
          method: "PUT",
          data: filteredToUpdate,
        });
        const users = JSON.parse(await redis.get("users"));
        if (users) {
          const notFiltered = users.filter(
            (el) => el._id !== args.FinalBidderId
          );
          const [filtered] = users.filter(
            (el) => el._id === args.FinalBidderId
          );

          if (filtered !== undefined) {
            filtered.email = filteredToUpdate.email || null;
            filtered.password = filteredToUpdate.password || null;
            filtered.hp = filteredToUpdate.hp || null;
            filtered.rating = filteredToUpdate.rating || null;
            filtered.quota = filteredToUpdate.quota || null;
            filtered.status = filteredToUpdate.status || null;
            notFiltered.push(filtered);
            redis.del("users");
            redis.set("users", JSON.stringify(notFiltered));
          }
        } else {
          const { data: dataGet } = await axios({
            url: baseUrl,
            method: "GET",
          });
          redis.set("users", JSON.stringify(dataGet));
        }
        return {
          status: 200,
          message: "Orchestrator successfully updated rating to userService",
          user: data,
        };
      } else {
        return {
          status: 404,
          message: "Orchestrator Validation: User not found",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: "Internal Server Error",
        user: {
          _id: "not found",
        },
      };
    }
  }

  static async updateStatus(_, args) {
    try {
      const { data: dataToFilter } = await axios({
        url: baseUrl,
        method: "GET",
      });

      const [dataToUpdate] = dataToFilter.filter(
        (el) => el.email === args.email
      );

      dataToUpdate.status = !dataToUpdate.status;

      const { data } = await axios({
        url: baseUrl + dataToUpdate._id,
        method: "PUT",
        data: dataToUpdate,
      });

      const { data: dataForRedis } = await axios({
        url: baseUrl,
        method: "GET",
      });

      redis.del("users");
      redis.set("users", JSON.stringify(dataForRedis));

      return {
        status: 200,
        message: "Orchestrator successfully updated status to userService",
        user: data,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal Server Error",
        user: {
          _id: "not found",
        },
      };
    }
  }
}

module.exports = Controller;
