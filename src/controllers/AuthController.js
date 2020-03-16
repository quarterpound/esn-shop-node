const express = require("express");
const validator = require("validate.js");
const bcrypt = require("bcryptjs");
const jwtCheck = require("../middlewares/Jwt");
const Database = require("../helpers/Database");
const User = require("../classes/User");

class AuthController {
    path = "/auth";

    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/", jwtCheck, this.authenticate);
    }

    authenticate = async (req, res) => {
        if (!req.tokenData) {
            if(!validator(req.body, this.authConstraint)) {
                const {email, pwd} = req.body;
                const t = await Database.db.collection('users').findOne({email});
                if(t) {
                    const hashedPwd = t.pwd;
                    if(await bcrypt.compare(pwd, hashedPwd)) {
                        return res.status(200).send(User.token(t));
                    }
                    return res.sendStatus(401);
                } 
                return res.sendStatus(404);
            }
            return res.sendStatus(400)
        } 
        const {id} = req.tokenData;
        const t = await Database.db.collection('users').findOne({id});
        if(t) {
            return res.status(200).send(User.token(t))
        }
        return res.sendStatus(404);
    }

    authConstraint = {
        email: {
            presence: true,
            email: true,
        },
        pwd: {
            presence: true,
            length: {
              minimum: 6,
            }
        },
    }
}

module.exports = AuthController;