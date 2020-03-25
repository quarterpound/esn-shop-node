const express = require("express");
const Database = require("../helpers/Database");
const jwtCheck = require("../middlewares/Jwt");
const Item = require("../classes/Item");

class ItemController {
    path = "/items";

    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.delete("/:id", jwtCheck, this.deleteOne);
        this.router.post("/", jwtCheck, this.createItem);
        this.router.get("/", jwtCheck, this.getAll);
        this.router.get("/:id", jwtCheck, this.getOne);
    }

    async getAll(req, res) {
		let searchParams = {quantity:{$gt: 0}}
		if(req.tokenData && ['webmaster', 'editor'].includes(req.tokenData.type)) {
			searchParams = {};
		}
        const t = await Database.db.collection("items").find(searchParams).toArray();
        res.json(t)
    }

    async getOne(req, res) {
		
		let searchParams = {id: req.params.id, quantity:{$gt: 0}}
		
		if(req.tokenData && ['webmaster', 'editor'].includes(req.tokenData.type)) {
			searchParams = {id: req.params.id};
		}
		
        if(req.params.id) {
            const t = await Database.db.collection("items").findOne(searchParams);
           if(t) {
               return res.json(t);
           }
           return res.sendStatus(404);
        }
    }

    async createItem(req, res) {
        if(req.tokenData && ['webmaster', 'editor'].includes(req.tokenData.type)) {
            const item = new Item(req.body);
            if(!item.getErrors()) {
                const result = await Database.db.collection("items").insertOne(item.json());
                if (result.insertedCount > 0) {
                    return res.status(201).send(item.json());
                }
                return res.sendStatus(500);
            }
            return res.sendStatus(400);
        }
        return res.sendStatus(401);
    }

    async deleteOne(req, res) {
        if(req.tokenData && ['webmaster', 'editor'].includes(req.tokenData.type)) {
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
        return res.sendStatus(401);
    }
}

module.exports = ItemController;