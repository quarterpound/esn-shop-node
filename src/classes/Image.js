const shortid = require("shortid");

class Image {
    constructor(body) {
        this.id = shortid.generate();
        this.path = body.filename;
        this.mimetype = body.mimetype
        this.size = body.size;
        this.createdAt = new Date();
    }

    json() {
        return this;
    }
}

module.exports = Image;