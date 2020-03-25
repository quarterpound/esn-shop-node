const express = require("express");
const Purchase = require("../classes/Purchase");
const Mail = require("../helpers/Mailer");
const jwtCheck = require("../middlewares/Jwt");
const Database = require("../helpers/Database");
const TelegramBot = require("node-telegram-bot-api");
const Message = require("../classes/Message");

class PurchaseController {
    path = "/purchases"
    constructor() {
        this.router = express.Router();
        this.initRoutes();
        this.bot = new TelegramBot(process.env.TELEGRAM_BOT);
        this.email = new Mail(process.env.MAIL_USER, process.env.MAIL_PASSWORD);
    }

    initRoutes() {
		this.router.put("/:id/close", jwtCheck, this.closeOrder);
        this.router.get("/", jwtCheck, this.getAll);
        this.router.post("/", this.makePurchase);
        this.router.get("/:id", jwtCheck, this.getOne);
        this.router.delete("/:id", jwtCheck, this.removeOne);
    }

    async getAll(req, res) {
        if(req.tokenData && ['webmaster', 'editor'].includes(req.tokenData.type)) {
            const t = await Database.db.collection("purchases").find({}).toArray();
            return res.json(t)
        }

        return res.status(401)
    }

    makePurchase = async (req, res) => {
        const purchase = new Purchase({...req.body, ip: req.ip});
        if(!purchase.getErrors()) {
            let errors = [];
            for(const item of purchase.items) {
                const t = await Database.db.collection("items").findOne({id: item.id, quantity: {$gte: item.quantity}});
                if (!t) errors.push(item.id);
            }

            if(errors.length === 0) {
                const f = await Database.db.collection("purchases").insertOne(purchase.json());
                if (f.insertedCount > 0) {
                    res.status(201).send(purchase.id);
                    for(const item of purchase.items) {
                        Database.db.collection("items").updateOne({id: item.id}, {$inc: {quantity: -1 * item.quantity}});
                    }
                    this.email.sendMail(purchase.email, {subject: `Order Confirmation ${purchase.id}`, html: `<h1>Hello World</h1>`});
                    return this.bot.sendMessage(process.env.TELEGRAM_CHAT, await new Message(purchase).toString());
                }
                return res.sendStatus(500);
            }
            return res.status(410).json(errors);

        }
        return res.sendStatus(400);
    }

    async getOne(req, res) {
        if(req.tokenData && ['webmaster', 'editor'].includes(req.tokenData.type)) {
            if(req.params.id) {
                const t = await Database.db.collection("purchases").findOne({id: req.params.id});
                if(t) {
                    return res.json(t)
                }
                return res.sendStatus(404);
            }
            return res.sendStatus(400);
        }
        return res.status(401)
    }
	
	closeOrder = async (req, res) => {
        if(req.tokenData && ['webmaster', 'editor'].includes(req.tokenData.type)) {
            if(req.params.id) {
                const t = await Database.db.collection("purchases").updateOne({id: req.params.id, isOpen: true}, {$set: {isOpen: false}});
                if(t.matchedCount > 0) {
                    if(t.modifiedCount > 0) {
                        return res.sendStatus(201);
                    }
                    return res.sendStatus(500);
                 }
                return res.sendStatus(404);
            }
            return res.sendStatus(400);
        }
        return res.status(401)
    }

    async removeOne(req, res) {
        if(req.tokenData && req.tokenData.type === 'webmaster') {
            if(req.params.id) {
                const t = await Database.db.collection("purchases").removeOne({id: req.params.id});
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

module.exports = PurchaseController;