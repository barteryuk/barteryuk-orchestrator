const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();

const baseUrl = process.env.PRODUCTAPI;
var arr

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
                redis.set("users", JSON.stringify(data.data));
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
}

module.exports = Controller;
