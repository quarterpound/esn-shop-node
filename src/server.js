const express = require("express");

class Server {
    app;
    port;

    constructor(appInit) {
        this.app = express();
        this.port = appInit.port;

        this.middleWares(appInit.middleWares);
        this.routes(appInit.routes);

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
    }
}

module.exports = Server;