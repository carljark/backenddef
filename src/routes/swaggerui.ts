import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../apioas3.json';
 
import { NextFunction, Request, Response, Router } from 'express';

class MainRoute {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    public test(req: Request, res: Response, next: NextFunction) {
        console.log('test');
        // res.end();
        next();
    }
    public routes() {
        this.router.use('/', swaggerUi.serve);
        this.router.get('/', this.test);
        this.router.get('/', swaggerUi.setup(swaggerDocument));
    }
}

const indexRoute = new MainRoute().router;
export default indexRoute;
