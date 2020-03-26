const express = require("express");
const https = require("https");

class Server {
    
    constructor(appInit) {
        this.app = express();
        this.app.disable('x-powered-by')
        this.port = appInit.port;
        this.secure = appInit.securePort;
        this.privateKey = appInit.privateKey;	
        this.cert = appInit.certificate;
        this.middleWares(appInit.middleWares);
        this.routes(appInit.routes);

        this.httpsServer = https.createServer({key: this.privateKey, cert: this.cert}, this.app);
    }

    middleWares(middleWares) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        })
    }

    routes(controllers) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        })
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`);
        })

        this.httpsServer.listen(this.secure, () => {console.log(`App listening on the https://localhost:${this.secure}`)});
    }
}

module.exports = Server;