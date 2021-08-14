import express from 'express';
import * as cluster from 'cluster';
import * as os from 'os';

import config from './config';

class Cluster {

    app: express.Application;
    port: number;
    count_cores: number;

    constructor( app: express.Application, port: number )
    {
        this.app         = app;
        this.port        = port;
        this.count_cores = os.cpus().length;
        this.upServer();
    }

    upServer(): void
    {

        if( config.production === false ){

            this.app.listen( this.port, (): void => {
                console.log(`DEVELOPMENT |||| Server on | Port: ${this.port} | Proccess: ${process.pid}`)
            });

        } else {

            if (cluster.isMaster) {

                console.log(`Master (proccess ${process.pid}) is running | This machine there are ${this.count_cores} cores`);
                for (let i = 0; i < this.count_cores; i++) {
                    cluster.fork();
                }
                
            } else {
            
                this.app.listen( this.port, (): void => {
                    console.log(`Server on | Port: ${this.port} | Proccess: ${process.pid}`)
                });
            
            }

        }

    }

}

export default Cluster;