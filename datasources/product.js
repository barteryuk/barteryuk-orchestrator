const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();

const baseUrl = process.env.PRODUCTAPI;

class Controller {

    static async findAll() {
    try {
      const products = JSON.parse(await redis.get("products"));
      if (products) {
        return products;
      } else {
        const { data } = await axios({
          url: `${baseUrl}getall`,
          method: "GET",
        });
        redis.set("users", JSON.stringify(data.data));
        return data.data;
      }
    } catch (error) {
      return console.log("error : ", error);
    }
  }

}

module.exports = Controller