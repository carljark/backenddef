import {  json, NextFunction, Request, Response, Router, static as estaticExpress, urlencoded } from 'express';

import coinsRoute from './coins-route';

import path from 'path';

class MainRoute {
    public router: Router;
    constructor() {
        this.router = Router();
        this.router.use(json());
        this.router.use(urlencoded({ extended: false}));
        this.routes();
    }
    public routes() {
        this.router.use('/', estaticExpress(path.join(__dirname, '../../public')));
        this.router.use('/api', coinsRoute);
    }
}

const indexRoute = new MainRoute().router;
export default indexRoute;
