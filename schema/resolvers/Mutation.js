const userController = require("../../datasources/user");
const adminController = require("../../datasources/admin");
const mailController = require("../../datasources/mail");
const paymentController = require("../../datasources/payment");
const productController = require("../../datasources/product");

// const cloudinary = require('cloudinary')

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

const Mutation = {
  // USER
  addUser: userController.create,
  updateUser: userController.put,
  deleteUser: userController.delete,
  login: userController.login,

  // RATING
  updateRating: userController.updateRating,

  // STATUS (BANNED)
  updateStatus: userController.updateStatus,

  // NOTIFICATION
  sendMail: mailController.sendMail,

  // ADMIN
  addAdmin: adminController.create,
  updateAdmin: adminController.put,
  deleteAdmin: adminController.delete,
  loginAdmin: adminController.login,

  // PAYMENT
  addPayment: paymentController.create,
  updatePayment: paymentController.put,

  // PRODUCT
  addProduct: productController.addProduct,
  bidItem: productController.bidItem,
  rejectBid: productController.rejectBid

  // async uploadImage(parent, { filename }) {
  //   console.log("UPLOADING IMAGE @ ORCHESTRATOR");
  //     // const { stream, filename, mimetype, encoding } = await file;

  //     // 1. Validate file metadata.

  //     // 2. Stream file contents into cloud storage:
  //     // https://nodejs.org/api/stream.html

  //     // 3. Record the file upload in your DB.
  //     // const id = await recordFile( … )

  //     // return { filename, mimetype, encoding };

  //     const path = require('path')
  //     const mainDir = path.dirname(require.main.filename)
  //     // const filename1 = `${}`

  //     console.log("MAINDIR IS: ", mainDir);
  //     console.log("FILENAME IS: ", filename);

  // const path = require("path");
  // const mainDir = path.dirname(require.main.filename);
  // const filename1 = `${}`

  //     // FROM YOUTUBE
  //     const photo = await cloudinary.v2.uploader.upload(filename)
  //     console.log(photo)

  //     return `${photo.public_id}.${photo.format}`

  // }
};

module.exports = Mutation;
