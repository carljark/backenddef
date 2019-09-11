import { json, NextFunction, Request, Response, Router, urlencoded } from 'express';
import { map, switchMap } from 'rxjs/operators';
import getData$ from '../coinmarketdata/getdata.function';
import config from '../environment';
import CoinsInterf from '../modelos/coins-responses';


class CoinsRoute {
  public router: Router;
  private dataResponse$ = getData$();
  constructor() {
    this.router = Router();
    this.router.use(json());
    this.router.use(urlencoded({ extended: false }));
    this.routes();
  }
  public mainRoute(req: Request, res: Response, next: NextFunction) {
    // al acceder a esta ruta establecemos una conexion permanente
    // con el cliente a traves de websockets con socket.io
    this.dataResponse$
    .pipe(
      switchMap((dataCoinsResponse) => CoinsInterf.insertOne(dataCoinsResponse), (resp) => resp),
    )
    .subscribe((dataResponse) => {
      // cojo los primeros 10 elementos
      const dataResultArray = dataResponse.data.slice(0, 10);
      res.send(dataResultArray);
      next();
    });
  }
  public getHistory(req: Request, res: Response, next: NextFunction): void {
    CoinsInterf.getAll()
    .subscribe((result) => {
      res.send(result);
    });
  }
  public getHistoryCoin(req: Request, res: Response, next: NextFunction): void {
    if (req.params.name !== 'undefined') {
      this.dataResponse$
      .pipe(
        map((resp) => resp.data.map((coin) => coin.name)),
        map((arrayName) => arrayName.findIndex((name) => name === req.params.name)),
      )
      .subscribe((index) => {
        if (index !== -1) {
          CoinsInterf.getHistoryFromDateToMinsAndName(new Date(), config.timeAmount, req.params.name)
          .subscribe((history) => {
            res.send(history);
          });
        } else {
          res.end();
        }
      });
    } else {
      res.end();
    }
  }
  public getCoinByName(req: Request, res: Response, next: NextFunction) {
    this.dataResponse$
    .subscribe((dataResponse) => {
      const coin = dataResponse.data.find((elto) => {
        return elto.name === req.params.coinName;
      });
      console.log(coin);
      if (coin) {
        res.json(coin.price);
      } else {
        console.log('req.query: ', req.query);
        res.send(`no se ha encontrado en coinbyname : ${req.query.coinName}`);
      }
    });
  }
  public getCoinById(req: Request, res: Response, next: NextFunction) {
    console.log('req.params.coinId', req.params.coinId);
    this.dataResponse$
    .subscribe((dataResponse) => {
      const coin = dataResponse.data.find((elto) => {
        return elto.id === parseInt(req.params.coinId, 10);
      });
      console.log(coin);
      if (coin) {
        res.json(coin);
      } else {
        res.send(`no se ha encontrado en coinbyid: ${req.params.name}`);
      }
    });
  }
  public routes() {
    this.router.get('/coins/ids/:coinId', this.getCoinById.bind(this));
    this.router.get('/coins/names/:coinName', this.getCoinByName.bind(this));
    this.router.get('/coins/history', this.getHistory.bind(this));
    this.router.get('/coins/history/:name', this.getHistoryCoin.bind(this));
    this.router.use('/coins', this.mainRoute.bind(this));
  }
}
const route = new CoinsRoute().router;
export default route;
