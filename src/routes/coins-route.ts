import {  json, NextFunction, Request, Response, Router, static as estaticExpress, urlencoded } from 'express';

class CoinsRoute {
    public router: Router;
    constructor() {
        this.router = Router();
        this.router.use(json());
        this.router.use(urlencoded({ extended: false}));
        this.routes();
    }
    public mainRoute(req: Request, res: Response, next: NextFunction) {
        res.json('coins value');
    }
    public routes() {
        this.router.use('/coins', this.mainRoute.bind(this));
    }
}

const route = new CoinsRoute().router;
export default route;
