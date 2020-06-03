require("dotenv").config();

const {generateToken} = require("../helpers/jwt");
const Redis = require("ioredis");
const redis = new Redis();

// CHAI THINGY
const chai = require("chai");
const chaiHttp = require("chai-http");
var assert = chai.assert; // Using Assert style
var expect = chai.expect; // Using Expect style
var should = chai.should(); // Using Should style
var res;
var errors;

var bidOK;
var bidRejected;

// CALL APIS
const productAPI = require("../datasources/product");
const userAPI = require("../datasources/user");

// NECESSARY GLOBAL VARIABLES
const tesPropicPath = "/mnt/c/Users/sandbox/Documents/HACKTIV8/PHASE2R/nagamerah.png";
const tesPropicPath1 = "/mnt/c/Users/sandbox/Documents/HACKTIV8/PHASE2R/nagaijo.png";
const testUserCreds = {
    email: "sample@mail.com",
    password: "hehehehe",
    hp: "0213456789",
};
const testUserCreds1 = {
    email: "sample1@mail.com",
    password: "hehehehe",
    hp: "0213579135",
};
var testToken;
var testToken1;
var product;
let sampleProduct;
let sampleProduct1;
let sampleProductId;
let sampleProductId1;
var collateral;
var collateralId;
var collateral1;
var collateralId1;
var testUserId;
var testUserId1;
var testUser;
var testUser1;
var testLoginCred;
var testLoginCred1;
const testInput = {
    title: "Ukiran kayu",
    description: "naga merah",
    photopath: tesPropicPath,
    tagStr: "contoh;kayu;merah",
    value: 5000000,
    category: "Used",
};
const testInput1 = {
    title: "Ukiran kayu",
    description: "naga ijo",
    photopath: tesPropicPath1,
    tagStr: "contoh;kayu;ijo",
    value: 5000000,
    category: "Used",
};
let wrongInput = {
    title: null,
    description: "naga merah",
    photopath: tesPropicPath,
    tagStr: "",
    value: -1,
    category: "Used",
};
var wrongId;
var res;
var mainBid;
var backupBid;

chai.use(chaiHttp);

/*
        BEFORE ALL BEGIN, WE WILL DO THESE AS PREP:
        1. CREATE 2 SAMPLE/TEST USERS, ONE FOR BIDDER ONE FOR BIDEE
        2. LOGIN USING TEST CREDENTIALS
        3. CREATE 1 PRODUCT AS COLLATERAL 
     */

// HOOKS START
before(async function () {
    console.log("---- PREPARATION TEST PRODUCTS ---");

    // CREATE TEST USERS
    testUser = await userAPI.create("", {
        user: {
            email: testUserCreds.email,
            password: testUserCreds.password,
            hp: testUserCreds.password,
        },
    });

    // console.log("--- TEST USER 1: ");
    // console.log(testUser);

    testUserId = testUser._id;

    testUser1 = await userAPI.create("", {
        user: {
            email: testUserCreds1.email,
            password: testUserCreds1.password,
            hp: testUserCreds1.password,
        },
    });

    // console.log("--- TEST USER 2: ");
    // console.log(testUser1);

    testUserId1 = testUser1._id;
    // END USER CREATE

    // LOGIN TEST USERS
    testLoginCred = await userAPI.login("", {
        email: testUserCreds.email,
        password: testUserCreds.password,
    });

    // console.log("--- TEST USER 1 LOGIN: ", testLoginCred);

    testToken = testLoginCred.access_token;

    testLoginCred1 = await userAPI.login("", {
        email: testUserCreds1.email,
        password: testUserCreds1.password,
    });

    // console.log("--- TEST USER 2 LOGIN: ", testLoginCred1);

    testToken1 = testLoginCred1.access_token;
    // END TEST LOGIN

    console.log(" -- ADD COLLATERAL --");
    collateral = await productAPI.addProduct("", testInput1, {token: testToken1}, "");
    // console.log("WHAT'S COLLATERAL?");
    // console.log(collateral, "\n");
    collateralId = collateral._id;

    collateral1 = await productAPI.addProduct("", testInput, {token: testToken1}, "");
    // console.log("WHAT'S COLLATERAL?");
    // console.log(collateral, "\n");
    collateralId1 = collateral1._id;
    console.log(" -- ADD COLLATERAL END --");

    console.log("---- PREPARATION TEST PRODUCTS END ---");
    // done();
});

after(async function () {
    console.log("---- CLOSING PRODUCTS TEST ---");

    // DELETE ALL TEST USERS & PRODUCTS

    // DELETE SAMPLE USERS
    var final = await Promise.all([
        userAPI.delete("", {_id: testLoginCred.userId}),
        userAPI.delete("", {_id: testLoginCred1.userId}),
        productAPI.dropItem("", {itemId: String(sampleProductId)}, {token: testToken}, ""),
        productAPI.dropItem("", {itemId: String(sampleProductId1)}, {token: testToken}, ""),
        // productAPI.dropItem("", {itemId: String(collateralId)}, {token: testToken1}, ""),
        productAPI.dropItem("", {itemId: String(collateralId1)}, {token: testToken1}, "")
    ]);
    // await userAPI.delete("", {_id: testUserId});
    // await userAPI.delete("", {_id: testUserId1});
    // console.log("HOW'S FINAL CLEANUP?");
    // console.log(final[2]);
    final;

    console.log("---- CLOSING TEST PRODUCTS END ---");
});
//HOOKS END

describe("PRODUCTS TESTS", () => {
    // MUTATION - ADD PRODUCT
    describe("MUTATION - addProduct", () => {
        it("SUCCESSFUL - Server created a product", async () => {
            res = await productAPI.addProduct("", testInput, {token: testToken}, "");
            // expect(res).to.have.status(201);

            // console.log("this is res.body create product");
            // console.log(res);

            product = res;

            sampleProduct = product;
            sampleProductId = product._id;

            // EXPECT PROPERTIES: COMPULSTORY ONES
            expect(product).to.have.property("title").that.is.a("String");
            expect(product).to.have.property("value").that.is.a("Number");
            expect(product).to.have.property("description").that.is.a("String");
            expect(product).to.have.property("userId").that.is.a("String");
            expect(product).to.have.property("photo").that.is.a("String");

            // // EXPECT FORMAT
            // expect(product.title).to.be.a("String");
            // expect(product.description).to.be.a("String");
            // expect(product.photo).to.be.a("String");
            // expect(product.userId).to.be.a("String");
            // expect(product.value).to.be.a("Number");
        });

        it("SUCCESSFUL - Redis created a product", async () => {
            res = await productAPI.addProduct("", testInput, {token: testToken}, "");
            product = res;

            sampleProduct1 = product;
            sampleProductId1 = product._id;
            await redis.del("products");
            // EXPECT PROPERTIES: COMPULSTORY ONES
            expect(product).to.have.property("title").that.is.a("String");
            expect(product).to.have.property("value").that.is.a("Number");
            expect(product).to.have.property("description").that.is.a("String");
            expect(product).to.have.property("userId").that.is.a("String");
            expect(product).to.have.property("photo").that.is.a("String");

            // // EXPECT FORMAT
            // expect(product.title).to.be.a("String");
            // expect(product.description).to.be.a("String");
            // expect(product.photo).to.be.a("String");
            // expect(product.userId).to.be.a("String");
            // expect(product.value).to.be.a("Number");
        });

        it("FAILED - Server returns ERROR 400 IF MISSING/WRONG PARAMS: TITLE, PHOTOPATH, VALUES, TAGSTR", async () => {
            res = await productAPI.addProduct("", wrongInput, {token: testToken}, "");
            // console.log("WHAT'S RES ERROR CREATE PRODUCT?");
            // console.log(res, "\n\n");
            expect(res).to.have.property("status", 400);
            expect(res).to.have.property("message").that.is.a("String");
        });

        // ADD COLLATERAL AFTER
        afterEach(async function () {
            // clear cache
            // console.log("BEFORE CLEAR CACHE, WHAT IS CURRENT CACHE?");
            // console.log(JSON.parse(await redis.get("products")), "\n\n");
            await redis.del("products");
            // console.log("WHAT IS CACHE NOW?");
            // console.log(JSON.parse(await redis.get("products")), "\n\n");
        });
    });
    // ADD PRODUCT END

    // QUERY - ALL PRODUCTS
    describe("Query - findAll PRODUCTS", () => {
        it("SUCCESSFUL - Server returns all when products can be found", async () => {
            res = await productAPI.findAll();
            // console.log("WHAT'S REALLY ALL RESULT?");
            // console.log(res);
            // expect(res.data).to.be.an("Array");
            expect(res).to.be.an("Array");
        });

        it("SUCCESSFUL - Redis returns all when ALL PRODUCTS can be found", async () => {
            res = await productAPI.findAll();
            // console.log("WHAT'S REALLY ALL RESULT?");
            // console.log(res);
            // expect(res.data).to.be.an("Array");
            expect(res).to.be.an("Array");
        });
    });
    // QUERY - ALL PRODUCTS END

    // QUERY - ONE PRODUCT
    describe("Query - findOne PRODUCT", () => {
        it("SUCCESSFUL - Server returns all A product can be found", async () => {
            redis.del("products");
            res = await productAPI.findOne("", {productid: sampleProductId}, "", "");
            // console.log("WHAT'S REALLY ALL RESULT?");
            // console.log(res);

            expect(res).to.have.property("title").that.is.a("String");
            expect(res).to.have.property("value").that.is.a("Number");
            expect(res).to.have.property("description").that.is.a("String");
            expect(res).to.have.property("userId").that.is.a("String");
            expect(res).to.have.property("photo").that.is.a("String");
        });

        it("SUCCESSFUL - Redis returns A PRODUCT can be found", async () => {
            res = await productAPI.findOne("", {productid: sampleProductId}, "", "");
            console.log("WHAT'S REALLY ALL RESULT?");
            console.log(res);

            expect(res).to.have.property("title").that.is.a("String");
            expect(res).to.have.property("value").that.is.a("Number");
            expect(res).to.have.property("description").that.is.a("String");
            expect(res).to.have.property("userId").that.is.a("String");
            expect(res).to.have.property("photo").that.is.a("String");
        });

        it("FAILED - Server returns status 404 when PRODUCT cannot be found", async () => {
            res = await productAPI.findOne("", {productid: `${sampleProductId}01`}, "", "");
            // console.log(res);

            expect(res).to.have.property("status", 404);
            expect(res).to.have.property("message").that.is.a("String");
            // expect(result).to.have.property("message", "Orchestrator Validation: Admin not found");
        });
    });
    // QUERY - ONE PRODUCT END

    // QUERY - OWN PRODUCTS
    describe("Query - find OWN PRODUCTS", () => {
        it("SUCCESSFUL - Server returns all when OWN products can be found - SERVER", async () => {
            redis.del("products");
            res = await productAPI.findOwnItems("", "", {token: testToken}, "");
            console.log("WHAT'S REALLY ALL RESULT?");
            console.log("RES FOR FINDING OWN ITEMS");
            console.log(res);
            expect(res).to.be.an("Array");
        });

        it("SUCCESSFUL - Redis returns all when OWN PRODUCTS can be found - CACHE", async () => {
            res = await productAPI.findOwnItems("", "", {token: testToken}, "");
            console.log("WHAT'S REALLY ALL RESULT?");
            console.log("RES FOR FINDING OWN ITEMS @ CACHE");
            console.log(res);
            expect(res).to.be.an("Array");
        });

        it("FAILED - Server returns status ? when OWN PRODUCT cannot be found", async () => {
            res = await productAPI.findOwnItems("", "", {token: `${testToken}01`}, "");
            // console.log(res);

            expect(res).to.have.property("status", 400);
            expect(res).to.have.property("message").that.is.a("String");
            // expect(result).to.have.property("message", "Orchestrator Validation: Admin not found");
        });
    });
    // QUERY - OWN PRODUCTS END


    // MUTATION - SET PRIMELIST
    describe("MUTATION - SET PRIMELIST ", () => {
        it("SUCCESSFUL - Server set primelist", async () => {
            res = await productAPI.setPrimeList(
                "",
                {
                    itemId: String(sampleProductId),
                    numDays: 2,
                },
                {token: testToken},
                ""
            );
            // expect(res).to.have.status(201);

            console.log("this is res after updating primelist");
            console.log(res);

            // EXPECT PROPERTIES: COMPULSTORY ONES
            expect(res).to.have.property("message").that.is.a("String");
            expect(res).to.have.property("result").that.is.a("Object");
        });

        it("FAILED - Server returns ERROR 400 IF CLOSE BID MISSING/WRONG PARAMS: TOKEN", async () => {
             res = await productAPI.setPrimeList(
                "",
                {
                    itemId: String(sampleProductId),
                    numDays: 2,
                },
                {token: `${testToken}-01`},
                ""
            );
            // console.log("WHAT'S RES ERROR CLOSE BID?");
            // console.log(res, "\n\n");
            expect(res).to.have.property("status", 400);
            expect(res).to.have.property("message").that.is.a("String");
        });

        it("FAILED - Server returns ERROR 400 IF CLOSE BID HAVE WRONG COLLATERAL/ITEM ID", async () => {
            res = await productAPI.setPrimeList(
                "",
                {
                    itemId: "",
                    numDays: 2,
                },
                {token: `${testToken}-01`},
                ""
            );
            // console.log("WHAT'S RES ERROR CLOSE BID?");
            // console.log(res, "\n\n");
            expect(res).to.have.property("status", 400);
            expect(res).to.have.property("message").that.is.a("String");
        });
    });
    // MUTATION - SET PRIMELIST END

    // MUTATION - BID PRODUCT
    describe("MUTATION - bidItem", () => {
        it("SUCCESSFUL - Server bid a product", async () => {
            res = await productAPI.bidItem(
                "",
                {
                    itemId: String(sampleProductId),
                    collateralId: String(collateralId),
                },
                {token: testToken1},
                ""
            );
            // expect(res).to.have.status(201);

            console.log("this is res.body for bid product");
            console.log(res);
            mainBid = res;

            // EXPECT PROPERTIES: COMPULSTORY ONES
            expect(res).to.have.property("message").that.is.a("String");
            expect(res).to.have.property("result").that.is.a("Object");
        });

        it("FAILED - Server returns ERROR 400 IF  BID MISSING/WRONG PARAMS: TOKEN OR ID", async () => {
            res = await productAPI.bidItem(
                "",
                {
                    itemId: String(sampleProductId),
                    collateralId: String(collateralId),
                },
                {token: `${testToken1}-01`},
                ""
            );
            console.log("WHAT'S RES ERROR BID PRODUCT?");
            console.log(res, "\n\n");
            expect(res).to.have.property("status", 400);
            expect(res).to.have.property("message").that.is.a("String");
        });

        // COUNTERBID
        afterEach(async () => {
            console.log("BACKUP BID FOR BACKUP");
            backupBid = await productAPI.bidItem(
                "",
                {
                    itemId: String(sampleProductId1),
                    collateralId: String(collateralId1),
                },
                {token: testToken1},
                ""
            );

            // console.log("HOW'S BACKUP BID");
            // console.log(backupBid)

            // return productAPI.bidItem("", {
            //     itemId: String(sampleProductId1),
            //     collateralId: String(collateralId1)
            // }, {token: testToken1}, "")
            // .then(response => {
            //     console.log("HOW IS SECOND BID?");
            //     console.log(response);
            //     backupBid = response
            //     // done()
            // })
        });
    });
    // MUTATION - BID PRODUCTEND


    // MUTATION - ACCEPT BID
    describe("MUTATION - ACCEPT closeBid", () => {
        it("SUCCESSFUL - Server close a bid", async () => {
            res = await productAPI.closeBid(
                "",
                {
                    itemId: String(sampleProductId),
                    collateralId: String(collateralId),
                },
                {token: testToken},
                ""
            );
            // expect(res).to.have.status(201);

            // console.log("this is res.body for bid product");
            // console.log(res);
            bidOK = res;

            // EXPECT PROPERTIES: COMPULSTORY ONES
            expect(res).to.have.property("message").that.is.a("String");
            expect(res).to.have.property("result").that.is.a("Object");
        });

        it("FAILED - Server returns ERROR 400 IF CLOSE BID MISSING/WRONG PARAMS: TOKEN OR ID", async () => {
            res = await productAPI.closeBid(
                "",
                {
                    itemId: String(sampleProductId),
                    collateralId: String(collateralId),
                },
                {token: `${testToken}-01`},
                ""
            );
            // console.log("WHAT'S RES ERROR CLOSE BID?");
            // console.log(res, "\n\n");
            expect(res).to.have.property("status", 400);
            expect(res).to.have.property("message").that.is.a("String");
        });

        it("FAILED - Server returns ERROR 404 IF CLOSE BID HAVE WRONG COLLATERAL/ITEM ID", async () => {
            res = await productAPI.closeBid(
                "",
                {
                    itemId: "",
                    collateralId: "",
                },
                {token: testToken},
                ""
            );
            // console.log("WHAT'S RES ERROR CLOSE BID?");
            // console.log(res, "\n\n");
            expect(res).to.have.property("status", 404);
            expect(res).to.have.property("message").that.is.a("String");
        });
    });
    // MUTATION - ACCEPT BID END


    // MUTATION - REJECT BID
    describe("MUTATION - rejectBid", () => {
        it("SUCCESSFUL - Server REJECT a bid", async () => {
            res = await productAPI.rejectBid(
                "",
                {
                    itemId: String(sampleProductId1),
                    collateralId: String(collateralId1),
                },
                {token: testToken},
                ""
            );
            // expect(res).to.have.status(201);

            // console.log("this is res.body for bid product");
            // console.log(res);
            bidRejected = res;

            // EXPECT PROPERTIES: COMPULSTORY ONES
            expect(res).to.have.property("message").that.is.a("String");
            expect(res).to.have.property("result").that.is.a("Object");
        });

        it("FAILED - Server returns ERROR 400 IF REJECT BID MISSING/WRONG PARAMS: TOKEN", async () => {
            res = await productAPI.rejectBid(
                "",
                {
                    itemId: String(sampleProductId1),
                    collateralId: String(collateralId1),
                },
                {token: `${testToken}-01`},
                ""
            );
            // console.log("WHAT'S RES ERROR CLOSE BID?");
            // console.log(res, "\n\n");
            expect(res).to.have.property("status", 400);
            expect(res).to.have.property("message").that.is.a("String");
        });

        it("FAILED - Server returns ERROR 404 IF REJECT BID HAVE WRONG COLLATERAL/ITEM ID", async () => {
             res = await productAPI.rejectBid(
                "",
                {
                    itemId: "",
                    collateralId: "",
                },
                {token: testToken},
                ""
            );
            // console.log("WHAT'S RES ERROR CLOSE BID?");
            // console.log(res, "\n\n");
            expect(res).to.have.property("status", 404);
            expect(res).to.have.property("message").that.is.a("String");
        });
    });
    // MUTATION - REJECT BID END

    // MUTATION - DROP ITEM
    describe("MUTATION - DELETE ITEM", () => {
        console.log("WE TEST USING THE COLLATERALS");
        it("SUCCESSFUL - Server delete a product", async () => {
            res = await productAPI.dropItem(
                "",
                {
                    itemId: String(collateralId),
                },
                {token: testToken1},
                ""
            );
            // expect(res).to.have.status(201);

            console.log("this is res.body for DELETE A PRODUCT");
            console.log(res);

            // EXPECT PROPERTIES: COMPULSTORY ONES
            expect(res).to.have.property("message").that.is.a("String");
            expect(res).to.have.property("result").that.is.a("Object");
        });

        it("FAILED - Server returns ERROR 400 IF DROP PRODUCT HAVE WRONG PARAMS: TOKEN", async () => {
            res = await productAPI.dropItem(
                "",
                {
                    itemId: String(collateralId1),
                },
                {token: `${testToken1}-01`},
                ""
            );
            console.log("WHAT'S RES ERROR DROP PRODUCT?");
            console.log(res, "\n\n");
            expect(res).to.have.property("status", 400);
            expect(res).to.have.property("message").that.is.a("String");
        });

        it("FAILED - Server returns ERROR 500 IF DROP PRODUCT HAVE WRONG ID", async () => {
            res = await productAPI.dropItem(
                "",
                {
                    itemId: `${String(collateralId1)}-01`,
                },
                {token: testToken1},
                ""
            );
            // console.log("WHAT'S RES ERROR DROP PRODUCT?");
            // console.log(res, "\n\n");
            expect(res).to.have.property("status", 500);
            expect(res).to.have.property("message").that.is.a("String");
        });
    });
    // MUTATION -  DROP ITEM END
});
