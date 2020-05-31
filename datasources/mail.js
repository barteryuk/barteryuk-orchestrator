const axios = require("axios");

const baseUrl = process.env.MAILAPI;

class Controller {
  static async sendMail(_, args) {
    try {
      const { data } = await axios({
        url: baseUrl + "sendNewBid",
        method: "POST",
        data: { email: args.email },
      });
      return {
        status: data.status,
        message: data.message,
      };
    } catch (error) {
      console.log(error.response.data);
      return {
        status: error.response.data.status,
        message: error.response.data.message,
      };
    }
  }
}

module.exports = Controller;
