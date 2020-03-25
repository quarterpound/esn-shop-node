const express = require("express");
const Database = require("../helpers/Database");

class CategoryController {
    path = "/categories";

    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes = () => {
        this.router.get("/", this.getAll);
        this.router.get("/:id", this.getOne);
    }

    async getAll(req, res) {
        const t = await Database.db.collection("items").distinct("category", {quantity: {$gt: 0}});
        return res.json(t)
    }

    async getOne(req, res) {
        if(req.params.id) {
            const t = await Database.db.collection("items").find({category: req.params.id}).toArray();
            return res.json(t);
        }
        return res.sendStatus(400);
    }
}
module.exports = CategoryController;