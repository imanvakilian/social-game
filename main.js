const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { createServer } = require('http');
const mongoose = require('mongoose');
const mainRouter = require('./src/app/router/main.routes');
const configSwagger = require('./config/swagger.config');
const errorHandler = require('./command/utils/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config({ override: true, path: "./.env" });

class Application {
    #app = express();
    #port;
    #db_name;
    constructor(port, dbname) {
        this.#port = port;
        this.#db_name = dbname;

        this.initApplication();
        this.createServer();
        this.initSwagger();
        this.connectToMongoDB();
        this.initRouters();
        this.errorHandler();
    }

    initApplication() {
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use(express.static("public"));
        this.#app.use(cookieParser(process.env.COOKIE_SECRET));
        this.#app.use(session({
            secret: process.env.COOKIE_SECRET,
            saveUninitialized: true,
            resave: true,
            cookie: {
                httpOnly: true,
                signed: true,
                secure: true,
            }
        }));
    }

    createServer() {
        const server = createServer(this.#app);
        server.listen(this.#port, () => {
            console.log(`server: http://localhost:${this.#port}`)
            console.log(`swagger: http://localhost:${this.#port}/swagger`)
        })
    }

    initSwagger() {
        this.#app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(configSwagger)));
    }

    connectToMongoDB() {
        mongoose.connect(this.#db_name);
        mongoose.connection.on("connected", () => console.log("mongo db connected successfully"));
        mongoose.connection.on("disconnected", () => {
            console.log("mongo db disconnected!")
            process.exit(0);
        });
    }

    initRouters() {
        this.#app.use(mainRouter)
    }

    errorHandler() {
        return errorHandler(this.#app)
    }

}

new Application(process.env.PORT, "mongodb://127.0.0.1:27017/team")