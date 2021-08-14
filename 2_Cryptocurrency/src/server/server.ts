import express from 'express';
import config from './config';
import cors from 'cors';

import mainRoutes from './../app/routes/mainRoutes'

class Server {

    app: express.Application;

    cors_whitelist: Array<string> = config.cors_whitelist;

    constructor()
    {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    async middlewares()
    {
        let cors_options = {
            origin: this.cors_whitelist,
            optionsSuccessStatus: 200
        }

        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());

        this.app.use( cors( cors_options ) );

    }

    routes()
    {
        this.app.use('/', mainRoutes);
    }

}

export default new Server().app;