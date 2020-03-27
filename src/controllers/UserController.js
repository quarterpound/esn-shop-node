const express = require("express");
const Database = require("../helpers/Database");
const jwtCheck = require("../middlewares/Jwt");
const User = require("../classes/User");

class UserController {
    path = "/users";

    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.use('/', jwtCheck);
        this.router.get("/", this.getAll);
        this.router.post("/", this.createUser);
        this.router.get("/:id", this.getOne);
        this.router.delete('/:id', this.deleteOne);
    }

    async getAll(req, res) {
        if(req.tokenData && req.tokenData.type === 'webmaster') {
            const t = await Database.db.collection("users").find({}).toArray();
            return res.json(t);
        }
        return res.sendStatus(401);
    }

    async getOne(req, res) {
        if(req.tokenData && (req.tokenData.type === 'webmaster' || req.tokenData.id === req.params.id)) {
            if(req.params.id) {
                const t = await Database.db.collection("users").findOne({id: req.params.id});
                if(t) {
                    return res.json(t);
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(400);
        }
        return res.sendStatus(401);
    }

    async createUser(req, res) {
        if(req.tokenData && req.tokenData.type === 'webmaster') {
            const user = new User(req.body);
            console.log(user.getErrors())
            if(!user.getErrors()) {
    
                const c = await Database.db.collection("users").findOne({email: user.email});
                if (!c) {
                    const result = await Database.db.collection("users").insertOne(await user.json());
                    if (result.insertedCount > 0) {
                        return res.sendStatus(201);
                    }
                    return res.sendStatus(500);
                }
    
                return res.sendStatus(409);
            }
            return res.sendStatus(400);
        }

        return res.sendStatus(401); 
    }

    async deleteOne(req, res) {
        if(req.tokenData && req.tokenData.type === 'webmaster') {
            if(req.params.id) {
                const t = await Database.db.collection("users").removeOne({id: req.params.id});
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

module.exports = UserController;