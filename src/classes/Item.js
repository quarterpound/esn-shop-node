const shortid = require("shortid");
const validatejs = require("validate.js");

class Item {
    constructor(body) {
        this.id = shortid.generate();
        this.creationDate = new Date();
        this.title = body.title;
        this.thumb = body.thumb;
        this.images = body.images;
        this.options = body.options;
        this.description = body.description;
        this.details = body.details;
		this.isOpen = true,
        this.price = parseFloat(body.price);
        this.category = body.category.toLowerCase().split(" ").join("-");
        this.quantity = parseInt(body.quantity);
    }

    getErrors() {
        const errors = validatejs(this, this.constraits);
        return errors;
    }

    constraits = {
        title: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 100,
            }
        },
        thumb : {
            presence: true,
            type: "string",
        },
        images: {
            presence: true,
            type: "array",
            length: {
                minimum: 1,
                maximum: 6,
            }
        },
        description: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 200,
            }
        },
        price: {
            presence: true,
            numericality: {
                greaterThan: 0,
                strict: true,
            }
        },
        category: {
            presence: true,
            type: "string",
        },
        quantity: {
            presence: true,
            numericality: {
                onlyInteger: true,
                strict: true,
                greaterThan: 0,
            }
        }

    }
    

    json() {
        delete this.constraits;
        return this;
    }
}

module.exports = Item;