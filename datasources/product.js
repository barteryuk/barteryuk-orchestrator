const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const {customError} = require("../helpers/customError");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const baseUrl = process.env.PRODUCTAPI;
var arr;
var token;
var payload;
var products;
var result;

class Controller {
    static async findAll() {
        // console.log("FIND ALL ITEMS @ ORCHESTRATOR");

        try {
            // products = JSON.parse(await redis.get("products"));
            products = JSON.parse(await redis.get("products"));

            // console.log("HAVE WE GOT PRODUCTS?");
            // console.log(products);
            if (products && products.length > 0) {
                // console.log("CACHE STILL ON");
                // if(products.data) {
                //     return products.data
                // } else {
                //     return products
                // }
                return products;
            } else {
                // console.log("NO CACHE");
                const result = await axios({
                    url: `${baseUrl}getall`,
                    method: "GET",
                });

                // console.log("WHAT'S PRODUCTS ALL?");
                // console.log(result.data.data);
                redis.set("products", JSON.stringify(result.data.data));
                return result.data.data;
            }
        } catch (error) {
            return {
                status: error.response.data.status,
                message: error.response.data.message,
            };
        }
    }

    static async findOne(parent, args, context, info) {
        console.log("NOW @ DATASOURCES FOR PRODUCT FIND ONE");

        const {productid} = args;
        console.log("this is id to found!");
        console.log(productid, "\n");

        try {
            const result = await axios({
                url: `${baseUrl}getall`,
                method: "GET",
            });

            arr = result.data.data;

            // console.log("DATA IS");
            // console.log(arr, "\n");

            products = JSON.parse(await redis.get("products"));
            // console.log("WHAT'S PRODUCT CACHE");
            // console.log(products, "\n");
            if (products && products.length > 0) {
                redis.del("products");
                redis.set("products", JSON.stringify(arr));
            } else {
                redis.set("products", JSON.stringify(arr));
            }

            const [filtered] = arr.filter((el) => String(el._id) == String(productid));
            // console.log("WHAT IS FILTERED?");
            // console.log(filtered, "\n");
            if (filtered !== undefined) {
                // return {
                //     status: 200,
                //     message: "Product Found",
                //     product: filtered,
                // };
                return filtered;
            } else {
                return {
                    status: 404,
                    message: "Orchestrator Validation:  Product not found",
                };
            }
        } catch (error) {
            return {
                status: error.response.data.status,
                message: error.response.data.message,
            };
        }
    }

    static async addProduct(parent, args, context, info) {
        // console.log("ADD PRODUCT FROM ORCHESTRATOR");

        // console.log("ARGS IS: ");
        // console.log(args, "\n");

        // console.log("PARENT IS: ");
        // console.log(parent, "\n");

        // console.log("CONTEXT IS: ");
        // console.log(context, "\n");

        // console.log("INFO IS: ");
        // console.log(info, "\n");

        //DECOMPOSE ARGS
        var {title, description, value, category, tagStr, photopath} = args;

        //  DECODE TOKEN
        token = context.token;
        // payload = jwt.verify(token, process.env.SECRET)

        // console.log("TOKEN IS: ,", token);
        // console.log("PAYLOAD IS: ,", payload);

        // UPLOAD IMAGE TO CLOUDINARY FIRST
        // FROM YOUTUBE
        //   const photo = await cloudinary.v2.uploader.upload(photopath)
        //   console.log(photo)

        //   var photoname = photo.url
        var photoname = photopath;

        try {
            var result = await axios({
                url: `${baseUrl}add`,
                method: "POST",
                headers: {
                    access_token: token,
                },
                data: {
                    title: title,
                    description: description,
                    value: value,
                    photopath: photoname,
                    category: category,
                    tagStr: tagStr,
                },
            });

            console.log("OK, WHAT'S RESULT AFTER ADDING?");
            console.log(result.data);

            var data = result.data.data;

            if (!data.errors) {
                products = JSON.parse(await redis.get("products"));
                // console.log("WHAT'S PRODUCTS CACHE?");
                // console.log(products);
                if (products && products.length > 0) {
                    // console.log("YEP, PRODUCT CACHE IS HERE! \n");
                    products.push(data);
                    redis.del("products");
                    redis.set("products", JSON.stringify(products));
                } else {
                    // console.log("NOPE! PRODUCT CACHE IS NOT HERE YET! \n");
                    result = await axios({
                        url: `${baseUrl}getall`,
                        method: "GET",
                    });
                    // console.log("IN CASE CACHE PRODUCTS GONE:");
                    // console.log(result, "\n");
                    redis.set("products", JSON.stringify(result.data.data));
                }
            }

            // return {
            //     status: 201,
            //     message: "Orchestrator successfully created data to adminService",
            //     admin: data,
            // };
            // console.log("DO WE SUCCEED ADD PRODUCT @ ORCHESTRATOR?");
            // console.log(data);
            return data;
        } catch (error) {
            // console.log("MASUUUK ERROR CREATE");
            // console.log(error, "\n");
            // console.log("error response is:");
            // console.log(error.response.data);
            return {
                status: error.response.data.status,
                message: error.response.data.message,
            };
        }
    }

    // CACHING FINDOWNITEMS
    static async findOwnItems(parent, args, context, info) {
        // console.log("FIND OWN ITEMS @ ORCHESTRATOR");

        var ownItems = [];
        var arrProducts;

        try {
            //  DECODE TOKEN
            token = context.token;
            payload = jwt.verify(token, process.env.SECRET);

            // console.log("TOKEN IS: ,", token);
            // console.log("PAYLOAD IS ,", payload);

            // GO TO PRODUCTS
            products = JSON.parse(await redis.get("products"));

            // console.log("WHAT IS REDIS' PRODUCTS AKA CACHE?");
            // console.log(products, "\n\n\n");

            if (products && products.length > 0) {
                // console.log("CACHE IS ON");
                arrProducts = products;
            } else {
                await redis.del("products");
                // console.log("CACHE IS OFF. GET A NEW ONE!");
                const result = await axios({
                    url: `${baseUrl}getall`,
                    method: "GET",
                    // ,headers: {
                    //     access_token: token
                    // }
                });
                products = result.data.data;

                // console.log("THIS IS THE PRODUCTS WE ABOUT TO CACHE?");
                // console.log(products, "\n\n\n");

                await redis.set("products", JSON.stringify(products));
                arrProducts = products;
            }

            // console.log("IS PRODUCTS REALLY DATA.DATA?");
            // console.log(products, "\n\n");
            // console.log(arrProducts, "\n\n");

            ownItems = arrProducts.filter((product) => product.userId == payload._id);
            return ownItems;
        } catch (error) {
            // console.log("ERROR FIND OWN OBJECT");
            // console.log(error);
            // console.log(error.response);
            if (error.name == "JsonWebTokenError") {
                return {
                    status: 400,
                    message: "TOKEN INVALID",
                };
            }
            return {
                status: error.response.data.status,
                message: error.response.data.message,
            };
        }
    }

    // SELECT COLLATERAL TO BID
    static async bidItem(parent, args, context, info) {
        // console.log("SELECT COLLATERAL @ ORCHESTRATOR");
        // console.log(args);
        var itemId = args.itemId;
        var collateralId = args.collateralId;

        try {
            // VERIFY TOKEN
            token = context.token;
            payload = jwt.verify(token, process.env.SECRET);

            // console.log("TOKEN IS: ,", token);
            // console.log("PAYLOAD IS ,", payload);

            var result = await axios({
                url: `${baseUrl}bid/${itemId}/with/${collateralId}`,
                method: "PUT",
                headers: {
                    access_token: token,
                },
            });

            var bidmsg = result.data;

            redis.del("products");

            // console.log("WHAT'S FROM AXIOS?");
            // console.log(bidmsg, "\n");

            // console.log("WHAT'S BIDPRODUCTID");
            // console.log(bidmsg.result.bidProductId, "\n");

            // console.log("WHAT'S BIDPRODUCTID");
            // console.log(bidmsg.result.bidProductId[bidmsg.result.bidProductId.length - 1], "\n");

            // REDIS REFETCH DATA
            var newdata = await axios({
                url: `${baseUrl}getall`,
                method: "GET",
            });
            // console.log("MAKING SURE NEWDATA.DATA");
            // console.log(newdata.data);
            redis.set("products", JSON.stringify(newdata.data.data));

            return bidmsg;
        } catch (error) {
            // console.log("ERROR FIND OWN OBJECT");
            // console.log(error);
            // console.log(error.response);
            if (error.name == "JsonWebTokenError") {
                return {
                    status: 400,
                    message: "TOKEN INVALID",
                };
            }
            return {
                status: error.response.data.status,
                message: error.response.data.message,
            };
        }
    }

    // SELECT CASE CLOSED! CLOSING BID
    static async closeBid(parent, args, context, info) {
        console.log("CLOSE BID @ ORCHESTRATOR");
        console.log(args);
        var itemId = args.itemId;
        var collateralId = args.collateralId;

        try {
            // VALIDATE TOKEN
            token = context.token;
            payload = jwt.verify(token, process.env.SECRET);

            console.log("TOKEN IS: ,", token);
            console.log("PAYLOAD IS ,", payload);

            var {data} = await axios({
                url: `${baseUrl}closeBid/${itemId}/with/${collateralId}`,
                method: "PUT",
                headers: {
                    access_token: token,
                },
            });

            var bidmsg = data;

            redis.del("products");

            console.log("WHAT'S FROM AXIOS?");
            console.log(bidmsg, "\n");

            console.log("WHAT'S BIDPRODUCTID");
            console.log(bidmsg.result.bidProductId, "\n");

            console.log("WHAT'S BIDPRODUCTID");
            console.log(bidmsg.result.bidProductId[bidmsg.result.bidProductId.length - 1], "\n");

            // REDIS REFETCH DATA
            var newdata = await axios({
                url: `${baseUrl}getall`,
                method: "GET",
            });
            // console.log("MAKING SURE NEWDATA.DATA");
            // console.log(newdata.data);
            redis.set("products", JSON.stringify(newdata.data.data));

            return bidmsg;
        } 
        catch (error) {
            // console.log("ERROR FIND OWN OBJECT");
            // console.log(error);
            // console.log(error.response);
            if (error.name == "JsonWebTokenError") {
                return {
                    status: 400,
                    message: "TOKEN INVALID",
                };
            } 
            else {
                if(error.response.status && error.response.statusText) {
                    return {
                        status: error.response.status,
                        message: error.response.statusText,
                    };
                } else {
                    return {
                        status: error.response.data.status,
                        message: error.response.data.message,
                    };
                }
            }
        }
    }

    // REJECT BID
    static async rejectBid(parent, args, context, info) {
        console.log("SELECT COLLATERAL @ ORCHESTRATOR");
        console.log(args);
        var itemId = args.itemId;
        var collateralId = args.collateralId;

        try {
            token = context.token;
            payload = jwt.verify(token, process.env.SECRET);

            console.log("TOKEN IS: ,", token);
            console.log("PAYLOAD IS ,", payload);

            var {data} = await axios({
                url: `${baseUrl}rejectBid/${itemId}/with/${collateralId}`,
                method: "PUT",
                headers: {
                    access_token: token,
                },
            });

            var bidmsg = data;

            redis.del("products");

            console.log("WHAT'S FROM AXIOS?");
            console.log(bidmsg, "\n");

            console.log("WHAT'S NOW AFTER REJECT?");
            console.log(bidmsg.result.bidProductId, "\n");

            console.log("WHO'S LAST REMAINING BIDPRODUCTID?");
            console.log(bidmsg.result.bidProductId[bidmsg.result.bidProductId.length - 1], "\n");

            // REDIS REFETCH DATA
            var newdata = await axios({
                url: `${baseUrl}getall`,
                method: "GET",
            });
            // console.log("MAKING SURE NEWDATA.DATA");
            // console.log(newdata.data);
            redis.set("products", JSON.stringify(newdata.data.data));

            return bidmsg;
        } 
        catch (error) {
            // console.log("ERROR FIND OWN OBJECT");
            // console.log(error);
            // console.log(error.response);
            if (error.name == "JsonWebTokenError") {
                return {
                    status: 400,
                    message: "TOKEN INVALID",
                };
            } 
            else {
                if(error.response.status && error.response.statusText) {
                    return {
                        status: error.response.status,
                        message: error.response.statusText,
                    };
                } else {
                    return {
                        status: error.response.data.status,
                        message: error.response.data.message,
                    };
                }
            }
        }
    }

    // DROP ITEM
    static async dropItem(parent, args, context, info) {
        console.log("FIND OWN ITEMS @ ORCHESTRATOR");

        var {itemId} = args;

        try {
            //  DECODE TOKEN
            token = context.token;
            payload = jwt.verify(token, process.env.SECRET);

            console.log("TOKEN IS: ,", token);
            console.log("PAYLOAD IS ,", payload);

            var {data} = await axios({
                url: `${baseUrl}drop/${itemId}`,
                method: "DELETE",
                headers: {
                    access_token: token,
                },
            });

            var delmsg = data;

            redis.del("products");

            // REDIS REFETCH DATA
            var newdata = await axios({
                url: `${baseUrl}getall`,
                method: "GET",
            });
            // console.log("MAKING SURE NEWDATA.DATA");
            // console.log(newdata.data);
            redis.set("products", JSON.stringify(newdata.data.data));

            return delmsg;
        } 
        catch (error) {
            // console.log("ERROR FIND OWN OBJECT");
            // console.log(error);
            // console.log(error.response);
            if (error.name == "JsonWebTokenError") {
                return {
                    status: 400,
                    message: "TOKEN INVALID",
                };
            } 
            else {
                if(error.response.status && error.response.statusText) {
                    return {
                        status: error.response.status,
                        message: error.response.statusText,
                    };
                } else {
                    return {
                        status: error.response.data.status,
                        message: error.response.data.message,
                    };
                }
            }
        }
    }
}

module.exports = Controller;
