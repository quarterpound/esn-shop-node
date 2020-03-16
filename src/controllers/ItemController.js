const express = require("express");
const Database = require("../helpers/Database");
const Item = require("../classes/Item");

class ItemController {
    router;
    path = "/items";

    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.delete("/:id", this.deleteOne);
        this.router.post("/", this.createItem);
        this.router.get("/", this.getAll);
        this.router.get("/:id", this.getOne);
    }

    async getAll(req, res) {
        const t = await Database.db.collection("items").find().toArray();
        res.json(t)
    }

    async getOne(req, res) {
        if(req.params.id) {
            const t = await Database.db.collection("items").findOne({id: req.params.id});
           if(t) {
               return res.json(t);
           }
           return res.sendStatus(404);
        }
    }

    async createItem(req, res) {
        const item = new Item(req.body);
        if(!item.getErrors()) {
            const result = await Database.db.collection("items").insertOne(item.json());
            if (result.insertedCount > 0) {
                return res.sendStatus(201);
            }
            return res.sendStatus(500);
        }
        return res.sendStatus(400);
    }

    async deleteOne(req, res) {
        if(req.params.id) {
            const t = await Database.db.collection("items").removeOne({id: req.params.id});
            if(t.result.n === 0) {
                return res.sendStatus(404);
            }

            if(t.deletedCount < 1) {
                return res.sendStatus(500);
            }

            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }
}

module.exports = ItemController;