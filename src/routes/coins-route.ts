import {
  json,
  NextFunction,
  Request,
  Response,
  Router,
  static as estaticExpress,
  urlencoded,
} from 'express';

import fs from 'fs';

import socketio from 'socket.io';

import ISimpleCoin from '../coinmarketdata/simplecoin.interface';

import IDataCoin, {IresponseDataCoin} from '../coinmarketdata/datacoin.interface';

import getCoinValue from '../coinmarketdata/coins-value.function';

import callSample from '../coinmarketdata/getdatacoinmarket';

import getDataSample from '../coinmarketdata/getsampledata.function';

const sampleDataObject = getDataSample();

// fs.writeFileSync('./prueba.json', jsonData, 'utf8');

// callSample();

// getCoinValue();

class CoinsRoute {
  public router: Router;

//   public pricesArray: IDataCoin[] = [];
  public pricesArray: ISimpleCoin[] = [];

  constructor() {

    this.router = Router();
    this.router.use(json());
    this.router.use(urlencoded({ extended: false }));
    this.routes();
    // actualizamos los precios cada 60 segundos
    // sustituimos la llamada por los resultados guardados
    // para pruebas
    this.pricesArray = sampleDataObject;
    console.log(this.pricesArray);
    /* callSample()
      .then((response: IresponseDataCoin) => {
        console.log('bitcoin: ', response.data[0]);
        this.pricesArray = response.data;
        const jsD = JSON.stringify(response);
        // fs.writeFileSync('./samplecurrencylisting02.json', jsD, 'utf8');
      })
      .catch((err) => {
        console.log('API call error:', err.message);
      }); */
      // actualizo los precios desde server.ts
    // this.updatePrices();
  }
  public mainRoute(req: Request, res: Response, next: NextFunction) {
    // al acceder a esta ruta establecemos una conexion permanente
    // con el cliente a traves de websockets con socket.io

    const dataResultArray = this.pricesArray.filter((elto) => {
      return elto.name === 'bitcoin' || elto.name === 'ethereum';
    });
    console.log(dataResultArray);
    res.send(dataResultArray);
    next();
  }

  public bitCoinRoute(req: Request, res: Response, next: NextFunction) {
    const bitcoin = this.pricesArray.find((elto) => {
      return elto.name === 'bitcoin';
    });
    console.log(bitcoin);
    if (bitcoin) {
      res.json(bitcoin.price);
    } else {
      res.send('no se ha encontrado bitcoin');
    }
  }

  public ethereumCoinRoute(req: Request, res: Response, next: NextFunction) {
    const ethereum = this.pricesArray.find((elto) => {
      return elto.name === 'ethereum';
    });
    console.log(ethereum);
    if (ethereum) {
      res.json(ethereum.price);
    } else {
      res.send('no se ha encontrado ethereum');
    }
  }

  public routes() {
    this.router.get('/coins/bitcoin', this.bitCoinRoute.bind(this));
    this.router.get('/coins/ethereum', this.ethereumCoinRoute.bind(this));
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
