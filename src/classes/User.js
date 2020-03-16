const shortid = require("shortid");
const validator = require("validate.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class User {
    constructor(body) {
        this.id = shortid.generate();
        this.first = body.first;
        this.last = body.last;
        this.email = body.email;
        this.pwd = body.pwd;
        this.type = body.type;
        this.dateCreated = new Date();
    }

    getErrors() {
        return validator(this, this.constraints);
    }

    constraints = {
        first: {
            presence: true,
            type: 'string',
            length: {
                minimum: 1,
            }
        }, 
        last: {
            presence: true,
            type: "string",
            length: {
                minimum: 1,
            }
        },
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
        type:  {
            presence: true,
            inclusion: {
                within: ["editor"],
            }
        }
    }

    async json() {
        this.pwd = await bcrypt.hash(this.pwd, 8);
        this.first = this.first.toLowerCase();
        this.last = this.last.toLowerCase();
        this.email = this.email.toLowerCase();
        return this;
    }

    static token(user) {
        return jwt.sign({
            id: user.id, 
            first: user.first, 
            last: user.last,
            email: user.email,
            type: user.type,
            iat: Math.floor(Date.now() / 1000),
        }, process.env.JWT_SECRET, {expiresIn: '7d'})
    }

}

module.exports = User;