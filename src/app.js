const Server = require("./server");
require('dotenv').config()
const bodyParser = require("body-parser");
const ItemController = require("./controllers/ItemController");
const ImageController = require("./controllers/ImageController");
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");
const PurchaseController = require("./controllers/PurchaseController");
const Database = require("./helpers/Database");
const DBConnection = new Database(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@urlshortener-wbcij.mongodb.net/test?retryWrites=true&w=majority`);

const app = new Server({
    port: "3000",
    middleWares: [
        bodyParser.urlencoded({extended: true}),
        bodyParser.json()
    ],
    routes: [
        new PurchaseController(),
        new ItemController(),
        new ImageController(),
        new UserController(),
        new AuthController(),
    ]
})

DBConnection.connect(() => {
    app.listen();
})