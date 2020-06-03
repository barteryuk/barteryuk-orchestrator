const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();

const baseUrl = process.env.PAYMENTAPI;
const userUrl = process.env.USERAPI;

class Controller {
  static async findAll() {
    try {
      const payments = JSON.parse(await redis.get("payments"));
      if (payments) {
        return payments;
      } else {
        const result = await axios({
          url: baseUrl,
          method: "GET",
        });
        const data = result.data.data;
        redis.set("payments", JSON.stringify(data));
        return data;
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
          email: args.email,
          topUp: args.topUp,
        },
      });
      const data = result.data.data;
      if (!data.errors) {
        const payments = JSON.parse(await redis.get("payments"));
        if (payments) {
          payments.push(data);
          redis.del("payments");
          redis.set("payments", JSON.stringify(payments));
        } else {
          const { data: dataGet } = await axios({
            url: baseUrl,
            method: "GET",
          });
          const dataRedis = dataGet.data;
          redis.set("payments", JSON.stringify(dataRedis));
        }
      }

      return {
        status: 201,
        message: [
          {
            message: "Orchestrator successfully created data to paymentService",
          },
        ],
        payment: data,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal Server Error",
        payment: {
          id: "not found",
          email: "not found",
          topUp: 0,
          status: "not found",
          updatedAt: "not found",
          createdAt: "not found",
        },
      };
    }
  }
  static async put(_, args) {
    try {
      const resultFindById = await axios({
        url: baseUrl + args.id,
        method: "GET",
      });

      if (resultFindById.data.data.status === "pending") {
        const { data: dataToUpdate } = await axios({
          url: userUrl,
          method: "GET",
        });
        const [resultFindByName] = dataToUpdate.filter(
          (el) => el.email === resultFindById.data.data.email
        );
        const resultFromPaymentService = await axios({
          url: baseUrl + args.id,
          method: "PUT",
          data: {
            email: resultFindById.data.data.email,
            topUp: resultFindById.data.data.topUp,
            quota: resultFindByName.quota,
            proof: "url.jpg",
            status: args.status,
          },
        });
        if (args.status === "accept") {
          resultFindByName.quota =
            resultFindByName.quota + resultFindById.data.data.topUp;

          const resultFromUserService = await axios({
            url: userUrl + resultFindByName._id,
            method: "PUT",
            data: resultFindByName,
          });
        }

        const data = resultFromPaymentService.data.data[1][0];

        //REDIS UPDATE
        const resultPayments = await axios({
          url: baseUrl,
          method: "GET",
        });
        const resultUsers = await axios({
          url: userUrl,
          method: "GET",
        });

        const payments = resultPayments.data.data;
        const users = resultUsers.data;

        redis.del("payments");
        redis.set("payments", JSON.stringify(payments));
        redis.del("users");
        redis.set("users", JSON.stringify(users));

        return {
          status: 200,
          message: [
            {
              message:
                "Orchestrator successfully updated data to paymentService",
            },
          ],
          payment: data,
        };
      } else {
        return {
          status: 400,
          message: [
            {
              message:
                "Orchestrator validation: status has been handled before",
            },
          ],
          payment: resultFindById.data.data,
        };
      }
    } catch (error) {
      return {
        status: error.response.data.code,
        message: error.response.data.errors,
        payment: {
          id: "not found",
          email: "not found",
          topUp: 0,
          status: "not found",
          updatedAt: "not found",
          createdAt: "not found",
        },
      };
    }
  }
}

module.exports = Controller;
