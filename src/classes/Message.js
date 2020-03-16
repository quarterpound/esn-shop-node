const moment = require("moment");
const Database = require("../helpers/Database");

class Message {
    constructor(purchase){
        this.id = purchase.id;
        this.fullname = `${this.capitalize(purchase.first)} ${this.capitalize(purchase.last)}`;
        this.phoneNumber = purchase.phoneNumber;
        this.email = purchase.email;
        this.items = purchase.items;
        this.date = purchase.createdAt;
    }

    capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    itemsString = async () => {
        let res = ``;
        for (const item of this.items) {
            const t = await Database.db.collection("items").findOne({id: item.id})
            res+= `${t.title} ${item.quantity}\n`;
        }
        return res;
    }

    toString = async () => {
        return `Order #${this.id}\n${this.fullname}\n${this.phoneNumber}\n\nOrder Summary\n${await this.itemsString()}\n${moment(this.createdAt).format("MMMM Do, h:mm:ss a")}`
    }
}

module.exports = Message;