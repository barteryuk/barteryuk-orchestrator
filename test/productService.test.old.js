const app = require("../../productServices/app");
const request = require("supertest");

// process.env.NODE_ENV = "test";
const fs = require("fs");
// const mongoose = require('mongoose')
const {generateToken} = require("../helpers/jwt");

// CHAI THINGY
const chai = require("chai");
const chaiHttp = require("chai-http");
var assert = chai.assert; // Using Assert style
var expect = chai.expect; // Using Expect style
var should = chai.should(); // Using Should style
var res;
var errors;

const app = require("../app.js");
const {ObjectId} = require("mongoose").Types;
const tesPropicPath = "/mnt/c/Users/sandbox/Documents/HACKTIV8/PHASE2R/nagamerah.png";
// const {
//     createToken
// } = require('../helpers/jwt')
const Product = require("../models/product");
// const request = require("supertest");
const testUser = {
    _id: "tes123",
    email: "sample@mail.com",
    password: "hehehehe",
};
const testUser1 = {
    _id: "tes123",
    email: "sample1@mail.com",
    password: "hehehehe",
};
const testToken = generateToken(testUser, process.env.SECRET);
const testToken1 = generateToken(testUser1, process.env.SECRET);
let sampleProductId = "";
const testInput = {
    title: "Ukiran kayu",
    description: "naga merah",
    photopath: tesPropicPath,
    tagStr: "contoh;kayu",
    value: 5000000,
    userId: testUser._id,
};
const testInput1 = {
    title: "Ukiran kayu",
    description: "naga merah",
    photopath: tesPropicPath,
    tagStr: "contoh;kayu",
    value: 5000000,
    userId: testUser1._id,
};
let wrongInput = {};
var wrongId;
// let errors = [];
var testurl = "http://localhost:4003/products";
var product;
var collateral
var collateralId

chai.use(chaiHttp);

describe("MICROSERVICES TEST", () => {
    //HOOKS
    // before((done) => {
    //     mongoose.connect("mongodb://localhost/productServiceTestDB", {
    //         useUnifiedTopology: true,
    //         useNewUrlParser: true,
    //         useCreateIndex: true,
    //         useFindAndModify: false,
    //     });
    //     const db = mongoose.connection;
    //     db.on("error", console.error.bind(console, "connection error"));
    //     db.once("open", () => {
    //         console.log("We are connected to productServiceTestDB!");
    //         done();
    //     });
    // });

    before(async () => {

        collateral = await Product.create({
            title: testInput1.title,
            description: testInput1.description,
            value: testInput1.value,
            photo: testInput1.photopath,
            tagStr: testInput1.tagStr,
            userId: testInput1.userId
        })

        collateralId = collateral._id

    })

    after(async () => {
        await Product.deleteMany({userId: testInput.userId});
        await Product.deleteMany({userId: testInput1.userId});
    });

    // CREATE PRODUCT
    describe("ADD PRODUCT SERVICES TEST", () => {
        //SUCCESS
        it("create product success", async () => {
            try {
                res = await chai
                    .request(app)
                    .post("/products/add")
                    .type("form")
                    .set("access_token", testToken)
                    .send(testInput);
                // .field("title", testInput.title)
                // .field("description", testInput.description)
                // .field("value", testInput.value)
                // .field("userId", testInput.userId)
                // .attach("photo", tesPropicPath)

                expect(res).to.have.status(201);

                console.log("this is res.body create product");
                console.log(res.body);
                product = res.body.data;

                sampleProductId = String(product._id);

                // EXPECT PROPERTIES: COMPULSTORY ONES
                expect(product).to.have.property("title");
                expect(product).to.have.property("value");
                expect(product).to.have.property("description");
                expect(product).to.have.property("userId");
                expect(product).to.have.property("photo");

                // EXPECT FORMAT
                expect(product.title).to.be.a("String");
                expect(product.description).to.be.a("String");
                expect(product.photo).to.be.a("String");
                expect(product.userId).to.be.a("String");
                expect(product.value).to.be.a("Number");
            } catch (err) {
                error = err;
                console.log("this is error create product");
                console.error(error);
            }
        });

        // FAIL
        it("create product fail", async () => {
            wrongInput = {
                title: null,
                description: "naga merah",
                photopath: null,
                tagStr: "contoh;kayu",
                value: -1,
                userId: testUser._id,
            };

            try {
                res = await chai
                    .request(app)
                    .post("/products/add")
                    .set("access_token", testToken)
                    .type('form')
                    .send(wrongInput)
                    
                    // .field("title", "")
                    // .field("description", testInput.description)
                    // .field("value", -1)
                    // .field("userId", testInput.userId)
                    // .attach("photo", tesPropicPath);
            } catch (err) {
                error = err;
                // console.log("WHAT IS ERROR IN CREATING?");
                // console.log(error);

                expect(error).to.have.property("code");
                expect(error).to.have.property("message");
                expect(error.code).to.be(400);
                expect(error.message).to.be.a("String");
            }
        });
    });

    // READ PRODUCT
    describe("READ PRODUCT SERVICES TEST", () => {
        //SUCCESS READ ALL
        it("read all products success", async () => {
            try{

                res = await chai.request(app)
                    .get("/products/getall")

                expect(res).to.have.status(200);

                console.log("this is res.body for read all products");
                console.log(res.body);
                product = res.body.data

                // EXPECT PROPERTIES: COMPULSTORY ONES
                expect(res.body).to.have.property('data')

                // EXPECT FORMAT
                expect(product).to.be.a('Array')

            }
            catch(err) {
                error = err
                console.log("this is error");
                console.error(error);
            }

        });

        //SUCCESS READ ONE
        it("read one success", async () => {
            try{

                res = await chai.request(app)
                    .get(`/products/getone/${sampleProductId}`)

                expect(res).to.have.status(200);

                console.log("this is res.body for read one product");
                console.log(res.body);
                product = res.body.data

                // EXPECT PROPERTIES: COMPULSTORY ONES
                expect(res.body).to.have.property('data')

                // EXPECT FORMAT
                expect(product).to.be.a('Object')

            }
            catch(err) {
                error = err
                console.log("this is error read one product");
                console.error(error);
            }

        });


        //SUCCESS READ OWN ITEMS
        it("read own items success", async () => {
            try{

                res = await chai.request(app)
                    .get(`/products/myItems`)
                    .set("access_token", testToken)

                expect(res).to.have.status(200);

                console.log("this is res.body for read own's items");
                console.log(res.body);
                products = res.body.data

                // EXPECT PROPERTIES: COMPULSTORY ONES
                expect(res.body).to.have.property('data')

                // EXPECT FORMAT
                expect(products).to.be.a('Array')

            }
            catch(err) {
                error = err
                console.log("this is error read OWN ITEMS");
                console.error(error);
            }

        });

    });


    // BID ITEM SUCCESS
    describe("BID PRODUCTS TEST", () => {   
        // BID SUCCESS
        it("bid item success", async () => {
            try{

                res = await chai.request(app)
                    .put(`/products/bid/${sampleProductId}/with/${collateralId}`)
                    .set("access_token", testToken)

                expect(res).to.have.status(200);

                console.log("this is res.body for bid");
                console.log(res.body);

                // // EXPECT PROPERTIES: COMPULSTORY ONES
                expect(res.body).to.have.property('message')
                expect(res.body).to.have.property('result')

                // // EXPECT FORMAT
                expect(res.body.message).to.be.a('String')
                expect(res.body.result).to.be.a('Object')

            }
            catch(err) {
                error = err
                console.log("this is error BID ITEM");
                console.error(error);
            }

        });

        // REJECT BID SUCCESS
        it("REJECT bid item success", async () => {
            try{

                res = await chai.request(app)
                    .put(`/products/rejectBid/${sampleProductId}/with/${collateralId}`)
                    .set("access_token", testToken1)

                expect(res).to.have.status(200);

                console.log("this is res.body for REJECT bid");
                console.log(res.body);

                // // EXPECT PROPERTIES: COMPULSTORY ONES
                expect(res.body).to.have.property('message')
                expect(res.body).to.have.property('result')

                // // EXPECT FORMAT
                expect(res.body.message).to.be.a('String')
                expect(res.body.result).to.be.a('Object')

            }
            catch(err) {
                error = err
                console.log("this is error REJECT BID");
                console.error(error);
            }

        });


        // CLOSE BID SUCCESS
        it("CLOSE bid item success", async () => {
            try{

                res = await chai.request(app)
                    .put(`/products/closeBid/${sampleProductId}/with/${collateralId}`)
                    .set("access_token", testToken1)

                expect(res).to.have.status(200);

                console.log("this is res.body for CLOSE bid");
                console.log(res.body);

                // // EXPECT PROPERTIES: COMPULSTORY ONES
                expect(res.body).to.have.property('message')
                expect(res.body).to.have.property('result')

                // // EXPECT FORMAT
                expect(res.body.message).to.be.a('String')
                expect(res.body.result).to.be.a('Object')

            }
            catch(err) {
                error = err
                console.log("this is error CLOSE BID");
                console.error(error);
            }

        });

    })



    // DELETE PRODUCT TEST
    describe("READ PRODUCT SERVICES TEST", () => {
        it("drop item success", async () => {
            try{

                res = await chai.request(app)
                    .delete(`/products/drop/${sampleProductId}`)
                    .set("access_token", testToken)

                expect(res).to.have.status(200);

                console.log("this is res.body for read own's items");
                console.log(res.body);

                // EXPECT PROPERTIES: COMPULSTORY ONES
                expect(res.body).to.have.property('message')
                expect(res.body).to.have.property('result')

                // EXPECT FORMAT
                expect(res.body.message).to.be.a('String')
                expect(res.body.result).to.be.a('Object')

            }
            catch(err) {
                error = err
                console.log("this is error read one product");
                console.error(error);
            }

        });
    })


});

