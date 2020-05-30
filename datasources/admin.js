const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();

const baseUrl = process.env.ADMINAPI;

class Controller {
  static async findAll() {
    try {
      const admins = JSON.parse(await redis.get("admins"));
      if (admins) {
        return admins;
      } else {
        console.log("tembus findAll");
        const { data } = await axios({
          url: baseUrl,
          method: "GET",
        });
        console.log("tembus axios coy");
        redis.set("admins", JSON.stringify(data));
        return data;
      }
    } catch (error) {
      return console.log("error : ", error);
    }
  }

  static async findByName(parent, args, context, info) {
    try {
      console.log("tembus 1");
      console.log("ini args", args);
      const { data } = await axios({
        url: "http:localhost:4002/admins",
        method: "GET",
      });
      console.log("tembus 2");

      const admins = JSON.parse(await redis.get("admins"));
      if (admins) {
        redis.del("admins");
        redis.set("admins", JSON.stringify(data));
      } else {
        redis.set("admins", JSON.stringify(data));
      }

      const [filtered] = data.filter((el) => el.email === args.email);
      if (filtered !== undefined) {
        return {
          status: 200,
          message: "Admin Found",
          admin: filtered,
        };
      } else {
        return {
          status: 404,
          message: "Orchestrator Validation: Admin not found",
          admin: {
            _id: "not found",
            email: args.email,
            password: "not found",
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
          email: args.admin.email,
          password: args.admin.password,
        },
      });
      const { data } = result;
      if (!data.errors) {
        const admins = JSON.parse(await redis.get("admins"));
        if (admins) {
          admins.push(data);
          redis.del("admins");
          redis.set("admins", JSON.stringify(admins));
        } else {
          const { data: dataGet } = await axios({
            url: baseUrl,
            method: "GET",
          });
          redis.set("admins", JSON.stringify(dataGet));
        }
      }

      return {
        status: 201,
        message: "Orchestrator successfully created data to adminService",
        admin: data,
      };
    } catch (error) {
      return {
        status: error.response.data.status,
        message: error.response.data.message,
        admin: {
          _id: "not found",
          ...args.admin,
        },
      };
    }
  }

  static async put(_, args) {
    try {
      const { data } = await axios({
        url: baseUrl + args._id,
        method: "PUT",
        data: args.admin,
      });

      const admins = JSON.parse(await redis.get("admins"));
      if (admins) {
        const notFiltered = admins.filter((el) => el._id !== args._id);
        const [filtered] = admins.filter((el) => el._id === args._id);

        if (filtered !== undefined) {
          filtered.email = args.admin.email || null;
          filtered.password = args.admin.password || null;
          notFiltered.push(filtered);
          redis.del("admins");
          redis.set("admins", JSON.stringify(notFiltered));
        }
      } else {
        const { data: dataGet } = await axios({
          url: baseUrl,
          method: "GET",
        });
        redis.set("admins", JSON.stringify(dataGet));
      }
      if (data === null) {
        return {
          status: 404,
          message: "Orchestrator Validation: Admin not found",
        };
      } else {
        return {
          status: 200,
          message: "Orchestrator successfully updated data to adminService",
          admin: data,
        };
      }
    } catch (error) {
      return console.log("error : ", error);
    }
  }

  static async delete(_, args) {
    try {
      const { data } = await axios({
        url: baseUrl + args._id,
        method: "DELETE",
      });
      const admins = JSON.parse(await redis.get("admins"));
      if (admins) {
        const notFiltered = admins.filter((el) => el._id !== args._id);
        redis.del("admins");
        redis.set("admins", JSON.stringify(notFiltered));
      } else {
        const { data: dataGet } = await axios({
          url: baseUrl,
          method: "GET",
        });
        redis.set("admins", JSON.stringify(dataGet));
      }
      if (data === null) {
        return {
          status: 404,
          name: "Not Found",
          message: "Orchestrator Validation: Admin not found",
        };
      } else {
        return {
          status: 200,
          message: "Orchestrator successfully deleted data from adminService",
          admin: data,
        };
      }
    } catch (error) {
      return console.log("error : ", error);
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
        message: "Orchestrator successfully logged in admin to adminService",
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
}

module.exports = Controller;
