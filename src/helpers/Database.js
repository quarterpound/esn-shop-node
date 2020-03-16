const MongoClient = require("mongodb").MongoClient;

class Database {
    static db;
    url;
    constructor(url) {
        this.url = url;
    }

    connect(callback) {
        MongoClient.connect(this.url, { useUnifiedTopology: true }, (err, db) => {
            if (err) throw err;
            Database.db = db.db("esn-shop");
            callback();
        })
    }
}

module.exports = Database;