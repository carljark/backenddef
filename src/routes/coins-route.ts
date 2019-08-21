import {
  json,
  NextFunction,
  Request,
  Response,
  Router,
  static as estaticExpress,
  urlencoded,
} from 'express';

import ISimpleCoin from '../coinmarketdata/simplecoin.interface';

import getData$ from '../coinmarketdata/getdata.function';

const dataResponse$ = getData$();

import CoinsInterf from '../modelos/coins-responses';

class CoinsRoute {
  public router: Router;

  constructor() {

    this.router = Router();
    this.router.use(json());
    this.router.use(urlencoded({ extended: false }));
    this.routes();

  }
  public mainRoute(req: Request, res: Response, next: NextFunction) {
    // al acceder a esta ruta establecemos una conexion permanente
    // con el cliente a traves de websockets con socket.io
    dataResponse$
    .subscribe((dataResponse) => {
      console.log(dataResponse.data);
      /* const dataResultArray = dataResponse.data.filter((elto) => {
        return elto.name === 'bitcoin' || elto.name === 'ethereum';
      }); */
      // cojo los primeros 10 elementos
      const dataResultArray = dataResponse.data.slice(0, 10);
      // asignar donde se guarda
      // dataResponse.status.timestamp = new Date();
      res.send(dataResultArray);
      next();
    });
  }

  public bitCoinRoute(req: Request, res: Response, next: NextFunction) {
    dataResponse$
    .subscribe((dataResponse) => {
      const bitcoin = dataResponse.data.find((elto) => {
        return elto.name === 'bitcoin';
      });
      console.log(bitcoin);
      if (bitcoin) {
        res.json(bitcoin.price);
      } else {
        res.send('no se ha encontrado bitcoin');
      }
    });
  }

  public ethereumCoinRoute(req: Request, res: Response, next: NextFunction) {
    dataResponse$
    .subscribe((dataResponse) => {
      const ethereum = dataResponse.data.find((elto) => {
        return elto.name === 'ethereum';
      });
      console.log(ethereum);
      if (ethereum) {
        res.json(ethereum.price);
      } else {
        res.send('no se ha encontrado ethereum');
      }
    });
  }

  public getHistory(req: Request, res: Response, next: NextFunction): void {
    CoinsInterf.getAll()
    .subscribe((result) => {
      console.log('result de todas las respuestas', result);
      res.send(result);
    });
  }

  public getHistoryCoin(req: Request, res: Response, next: NextFunction): void {
    console.log('req.params: ', req.params.name);
    CoinsInterf.getHistoryFromDateToMinsAndName(new Date(), 10, req.params.name)
    .subscribe((history) => {
      console.log('icoinhistory: ', history);
      res.send(history);
    });
  }

  public routes() {
    this.router.get('/coins/bitcoin', this.bitCoinRoute.bind(this));
    this.router.get('/coins/ethereum', this.ethereumCoinRoute.bind(this));
    this.router.get('/coins/history', this.getHistory.bind(this));
    this.router.get('/coins/history/:name', this.getHistoryCoin.bind(this));
    this.router.use('/coins', this.mainRoute.bind(this));
  }

  public updatePrices() {
    setInterval(() => {
      console.log('actualizando precios');
      /* callSample()
        .then((response) => {
          console.log('bitcoin: ', response.data);
          this.pricesArray = response.data;
          // fs.writeFileSync('./samplecurrencylisting.json', JSON.stringify(response));
        })
        .catch((err) => {
          console.log('API call error:', err.message);
        }); */
    }, 60000);
  }
}

const route = new CoinsRoute().router;
export default route;
