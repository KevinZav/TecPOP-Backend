import express from 'express';

export default class Server {

    private port: Number = 3000;
    public app: express.Application;

    public constructor( port: Number ){
        this.port = port;
        this.app = express();
    }
    start( callback: Function ) {
        this.app.listen(this.port, callback());
    }

}