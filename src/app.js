const Server = require("./server");
const morgan = require("morgan");
const fs = require("fs");
const cors = require("cors");
require('dotenv').config()
const bodyParser = require("body-parser");
const ItemController = require("./controllers/ItemController");
const ImageController = require("./controllers/ImageController");
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");
const PurchaseController = require("./controllers/PurchaseController");
const CategoryController = require("./controllers/CategoryController");
const Database = require("./helpers/Database");
const DBConnection = new Database(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@urlshortener-wbcij.mongodb.net/test?retryWrites=true&w=majority`);

const app = new Server({
    port: process.env.PORT,
    middleWares: [
        bodyParser.urlencoded({extended: true}),
        bodyParser.json(),
        cors(),
		// morgan('dev'),
        morgan('common', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}),
    ],
    routes: [
        new PurchaseController(),
        new ItemController(),
        new ImageController(),
        new UserController(),
        new AuthController(),
        new CategoryController(),
    ]
})

DBConnection.connect(() => {
    app.listen();
})