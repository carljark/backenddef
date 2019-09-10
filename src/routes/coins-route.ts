import url from 'url';

import {
  json,
  NextFunction,
  Request,
  Response,
  Router,
  static as estaticExpress,
  urlencoded,
} from 'express';
import {  map, switchMap, tap } from 'rxjs/operators';

import getData$ from '../coinmarketdata/getdata.function';

import CoinsInterf from '../modelos/coins-responses';

import config from '../environment';

const dataResponse$ = getData$();

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
    .pipe(
      switchMap((dataCoinsResponse) => CoinsInterf.insertOne(dataCoinsResponse), (resp) => resp),
    )
    .subscribe((dataResponse) => {
      // console.log(dataResponse.data);
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
      // console.log(ethereum);
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
      // console.log('result de todas las respuestas', result);
      res.send(result);
    });
  }

  public getHistoryCoin(req: Request, res: Response, next: NextFunction): void {
    // console.log('req.params.name: ', req.params.name);
    // console.log('typeof req.params.name: ', (typeof req.params.name));
    // console.log('name in params: ', ('name' in req.params));
    if (req.params.name !== 'undefined') {
      dataResponse$
      .pipe(
        map((resp) => resp.data.map((coin) => coin.name)),
        map((arrayName) => arrayName.findIndex((name) => name === req.params.name)),
        tap((index) => console.log(index)),
      )
      .subscribe((index) => {
        // console.log('name finded: ', index);
        if (index !== -1) {
          CoinsInterf.getHistoryFromDateToMinsAndName(new Date(), config.timeAmount, req.params.name)
          .subscribe((history) => {
            // console.log('icoinhistory: ', history);
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
    const queryData = url.parse(req.url, true).query;
    if (queryData.coinName) {
      console.log('coinName: ', queryData.coinName);
    } else {
      console.log('no coinName');
    }
    dataResponse$
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
    dataResponse$
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
