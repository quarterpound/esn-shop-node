const express = require("express");
const multer = require("multer");
const path = require("path");
const Image = require("../classes/Image");
const Database = require("../helpers/Database");
const jwtCheck = require("../middlewares/Jwt");
const allowdTypes = ['image/jpeg', 'image/png']
const upload = multer({dest: path.join(__dirname, '../../uploads'), limits: {fileSize: 5000000}, fileFilter: (req, file, cb) => {
    if(allowdTypes.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error("These files are not supported"))
}});

class ImageController {
    path = "/images";

    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/", [jwtCheck, upload.array('photos', 5)], this.upload);
        this.router.get("/:id", this.get);
        this.router.delete("/:id", jwtCheck, this.remove)
    }

    async get(req, res) {
        if(req.params.id) {
            const result = await Database.db.collection("images").findOne({id: req.params.id});
            if(result) {
                res.header("Content-Type", result.mimetype);
                return res.sendFile(path.join(__dirname, "../../uploads", result.path));
            }

            return res.sendStatus(404);
        }

        return res.sendStatus(400);
    }

    async upload(req, res) {
        if(req.tokenData && ['webmaster', 'editor'].includes(req.tokenData.type)) {
            if(req.files.length !== 0) {
                const images = req.files.map(img => {
                    return new Image(img);
                });
    
                const result = await Database.db.collection("images").insertMany(images);
                if(result.insertedCount === images.length) {
                    return res.send(201).json(images.map(img => {return img.id}));
                }
    
                return res.status(500).json(images.map(img => {return img.id}))
            }
            return res.sendStatus(400);
        }
        return res.sendStatus(401); 
    }

    async remove(req, res) {
        if(req.tokenData && ['webmaster', 'editor'].includes(req.tokenData.type)) {
            if(req.params.id) {
                const t = await Database.db.collection("images").removeOne({id: req.params.id});
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
    }
}

module.exports = ImageController;