const shortid = require("shortid");
const validator = require("validate.js");

class Purchase {
    constructor(body) {
        this.id = shortid.generate();
        this.first = body.first;
        this.last = body.last;
        this.email = body.email;
        this.allowEmailSub = body.allowEmailSub;
        this.ip = body.ip;
        this.phoneNumber = body.phoneNumber;
        this.items = body.items;
        this.createdAt = new Date();
    }

    getErrors = () => {
        const purchaseCheck = validator(this, this.constPurchase);
        if(purchaseCheck) return purchaseCheck;
        this.items.forEach(item => {
            const itemCheck = validator(item, this.constItem);
            if(itemCheck) {
                return itemCheck;
            }
        });
        return null;
    }

    json() {
        delete this.constPurchase;
        delete this.constItem;
        return this;
    }

    constPurchase = {
        first: {
            presence: true,
            type: 'string',
            length: {
                minimum: 1,
                maximum: 30,
            }
        },
        last: {
            presence: true,
            type: 'string',
            length: {
                minimum: 1,
                maximum: 30,
            }
        },
        email: {
            presence: true,
            email: true,
        },
        allowEmailSub: {
            presence: true,
            type: 'boolean',
        },
        phoneNumber: {
            presence: true,
            type: 'string',
            length: {
                minimum: 9,
                maximum: 10,
            }
        },
        items: {
            presence: true,
            type: 'array',
        },
    }

    constItem = {
        id: {
            presence: true, 
            type: "string",
        },
        option: {
            type: "string",
        },
        quantity: {
            presence: true,
            numericality: {
                onlyInteger: true,
                greaterThan: 0
            }
        }
    }
}

module.exports = Purchase;