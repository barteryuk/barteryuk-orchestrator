const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();
const cloudinary = require('cloudinary')
const jwt = require('jsonwebtoken')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const baseUrl = process.env.PRODUCTAPI;
var arr
var token
var payload
var products
var result

class Controller {
    static async findAll() {
        try {
            const products = JSON.parse(await redis.get("products"));
            if (products) {
                return products;
            } else {
                const {data} = await axios({
                    url: `${baseUrl}getall`,
                    method: "GET",
                });
                redis.set("products", JSON.stringify(data.data));
                console.log("\n", "THIS IS RETRIEVED DATA", "\n");
                console.log(data.data, "\n")
                return data.data;
            }
        } catch (error) {
            return console.log("error : ", error);
        }
    }

    static async findOne(parent, args, context, info) {

        console.log("NOW @ DATASOURCES FOR PRODUCT FIND ONE");

        const {productid} = args
        console.log("this is id to found!");
        console.log(productid, "\n");

        try {
            const {data} = await axios({
                url: `${baseUrl}getall`,
                method: "GET",
            });


            arr = data.data

            console.log("DATA IS");
            console.log(arr, "\n");


            const products = JSON.parse(await redis.get("products"));
            console.log("WHAT'S PRODUCT CACHE");
            console.log(products, "\n");
            if (products) {
                redis.del("products");
                redis.set("products", JSON.stringify(arr));
            } else {
                redis.set("products", JSON.stringify(arr));
            }

            const [filtered] = arr.filter((el) => String(el._id) == String(productid));
            console.log("WHAT IS FILTERED?");
            console.log(filtered, "\n");
            if (filtered !== undefined) {
                // return {
                //     status: 200,
                //     message: "Product Found",
                //     product: filtered,
                // };
                return filtered
            } else {
                return {
                    status: 404,
                    message: "Orchestrator Validation:  Product not found"
                };
            }
        } catch (error) {
            return console.log("error : ", error);
        }
    }

    static async addProduct(parent, args, context, info) {
        console.log("ADD PRODUCT FROM ORCHESTRATOR");

        console.log("ARGS IS: ");
        console.log(args, "\n");


        // console.log("PARENT IS: ");
        // console.log(parent, "\n");

        console.log("CONTEXT IS: ");
        console.log(context, "\n");

        // console.log("INFO IS: ");
        // console.log(info, "\n");


        //DECOMPOSE ARGS
        var {title, description, value, category, tagStr, photopath} = args

        //  DECODE TOKEN
        token = context.token
        // payload = jwt.verify(token, process.env.SECRET)

        console.log("TOKEN IS: ,", token);
        // console.log("PAYLOAD IS: ,", payload);


        // UPLOAD IMAGE TO CLOUDINARY FIRST
        // FROM YOUTUBE
      const photo = await cloudinary.v2.uploader.upload(photopath)
      console.log(photo)

      var photoname = photo.url

      try {

          const {data} = await axios({
                url: `${baseUrl}add`,
                method: "POST",
                headers: {
                    access_token: token
                },
                data: {
                    title: title,
                    description: description,
                    value: value,
                    photopath: photoname,
                    category: category,
                    tagStr: tagStr
                }
            });

            console.log("DO WE SUCCEED ADD PRODUCT @ ORCHESTRATOR?");
            console.log(data.data);
            redis.del("products");
            return data.data;

      }
      catch(error) {
          return console.error(error)
      }


    }

    // static async findOwnItems(parent, args, context, info) {
    //     console.log("FIND OWN ITEMS @ ORCHESTRATOR");
    //     //  DECODE TOKEN
    //     token = context.token
    //     // payload = jwt.verify(token, process.env.SECRET)

    //     console.log("TOKEN IS: ,", token);

    //     try {
    //         const ownItems = JSON.parse(await redis.get("ownItems"));
    //         if (ownItems) {
    //             return ownItems;
    //         } else {
    //             const {data} = await axios({
    //                 url: `${baseUrl}myItems`,
    //                 method: "GET",
    //                 headers: {
    //                     access_token: token
    //                 }
    //             });
    //             redis.set("ownItems", JSON.stringify(data.data));
    //             return data.data;
    //         }
    //     } catch (error) {
    //         return console.log("error : ", error);
    //     }
    // }

    // CACHING FINDOWNITEMS
    static async findOwnItems(parent, args, context, info) {
        console.log("FIND OWN ITEMS @ ORCHESTRATOR");
        //  DECODE TOKEN
        token = context.token
        payload = jwt.verify(token, process.env.SECRET)

        console.log("TOKEN IS: ,", token);
        console.log("PAYLOAD IS ,", payload);
        var ownItems = []

        try {
            products = JSON.parse(await redis.get("products"));
            
            if (products) {
                ownItems = products.data.filter(product => product.userId == payload._id)
                
            } else {
                const {data} = await axios({
                    url: `${baseUrl}getall`,
                    method: "GET"
                    // ,headers: {
                    //     access_token: token
                    // }
                });
                products = data.data
                redis.del("products");
                redis.set("products", JSON.stringify(products));
                ownItems = products.filter(product => product.userId == payload._id)
                
            }
            redis.set("ownItems", JSON.stringify(ownItems));
            return ownItems;

        } catch (error) {
            return console.log("error : ", error);
        }
    }


    // SELECT COLLATERAL
    static async bidItem (parent, args, context, info) {
        console.log("SELECT COLLATERAL @ ORCHESTRATOR");
        console.log(args);
        var itemId = args.itemId
        var collateralId = args.collateralId

        token = context.token
        payload = jwt.verify(token, process.env.SECRET)

        console.log("TOKEN IS: ,", token);
        console.log("PAYLOAD IS ,", payload);

        try {
            
            
            var {data} = await axios({
                    url: `${baseUrl}bid/${itemId}/with/${collateralId}`,
                    method: "PUT"
                    ,headers: {
                        access_token: token
                    }
                });
            
            var bidmsg = data
            
            redis.del("products")

            console.log("WHAT'S FROM AXIOS?");
            console.log(bidmsg, "\n")

            console.log("WHAT'S BIDPRODUCTID");
            console.log(bidmsg.result.bidProductId, "\n")

            console.log("WHAT'S BIDPRODUCTID");
            console.log(bidmsg.result.bidProductId[bidmsg.result.bidProductId.length-1], "\n")

            // REDIS REFETCH DATA
             var newdata = await axios({
                    url: `${baseUrl}getall`,
                    method: "GET",
                });
                redis.set("products", JSON.stringify(newdata.data));

            return bidmsg

        }
        catch (error) {
            return console.log("error : ", error);
        }

    }


    // REJECT BID
    static async rejectBid (parent, args, context, info) {
        console.log("SELECT COLLATERAL @ ORCHESTRATOR");
        console.log(args);
        var itemId = args.itemId
        var collateralId = args.collateralId

        token = context.token
        payload = jwt.verify(token, process.env.SECRET)

        console.log("TOKEN IS: ,", token);
        console.log("PAYLOAD IS ,", payload);

        try {
            
            
            var {data} = await axios({
                    url: `${baseUrl}rejectBid/${itemId}/with/${collateralId}`,
                    method: "PUT"
                    ,headers: {
                        access_token: token
                    }
                });
            
            var bidmsg = data
            
            redis.del("products")

            console.log("WHAT'S FROM AXIOS?");
            console.log(bidmsg, "\n")

            console.log("WHAT'S NOW AFTER REJECT?");
            console.log(bidmsg.result.bidProductId, "\n")

            console.log("WHO'S LAST REMAINING BIDPRODUCTID?");
            console.log(bidmsg.result.bidProductId[bidmsg.result.bidProductId.length-1], "\n")

            // REDIS REFETCH DATA
             var newdata = await axios({
                    url: `${baseUrl}getall`,
                    method: "GET",
                });
                redis.set("products", JSON.stringify(newdata.data));

            return bidmsg

        }
        catch (error) {
            return console.log("error : ", error);
        }

    }
}

module.exports = Controller;
