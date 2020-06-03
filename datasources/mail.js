const axios = require("axios");

const baseUrl = process.env.MAILAPI;
const userUrl = process.env.USERAPI;

class Controller {
  static async sendMail(_, args) {
    try {
      console.log(args);
      const dataForEmail = await axios({
        url: userUrl + "/" + args.id,
        method: "GET",
      });
      const email = dataForEmail.data[0].email;

      const { data } = await axios({
        url: baseUrl + "sendNewBid",
        method: "POST",
        data: { email },
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
