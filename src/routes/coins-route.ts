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

import ISimpleCoin from './simplecoin.interface';

import IDataCoin, {IresponseDataCoin} from './datacoin.interface';

import getCoinValue from './coins-value.function';

import callSample from './coinmarketcap-sample';

const sampleDataFile = fs.readFileSync('./samplecurrencylisting.json');

const sampleDataObject: IresponseDataCoin = JSON.parse(sampleDataFile.toString());

const sampleDataJson = JSON.stringify(sampleDataObject);

// fs.writeFileSync('./prueba.json', jsonData, 'utf8');

// callSample();

// getCoinValue();

class CoinsRoute {
  public router: Router;

//   public pricesArray: IDataCoin[] = [];
  public pricesArray: IDataCoin[] = [];

  constructor() {

    this.router = Router();
    this.router.use(json());
    this.router.use(urlencoded({ extended: false }));
    this.routes();
    // actualizamos los precios cada 60 segundos
    // sustituimos la llamada por los resultados guardados
    // para pruebas
    this.pricesArray = sampleDataObject.data;
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
    this.updatePrices();
  }
  public mainRoute(req: Request, res: Response, next: NextFunction) {
    // al acceder a esta ruta establecemos una conexion permanente
    // con el cliente a traves de websockets con socket.io

    const dataResultArray = this.pricesArray.filter((elto) => {
      return elto.slug === 'bitcoin' || elto.slug === 'ethereum';
    });
    const dataSimpleArray = new Array<ISimpleCoin>();
    dataResultArray.forEach((coin) => {
      dataSimpleArray.push({
        id: coin.id,
        name: coin.slug,
        price: coin.quote.USD.price,
      });
    });
    console.log(dataSimpleArray);
    res.send(dataSimpleArray);
    next();
  }

  public bitCoinRoute(req: Request, res: Response, next: NextFunction) {
    const bitcoin = this.pricesArray.find((elto) => {
      return elto.slug === 'bitcoin';
    });
    console.log(bitcoin);
    if (bitcoin) {
      const simplebitcoin: ISimpleCoin = {
        id: bitcoin.id,
        name: bitcoin.slug,
        price: bitcoin.quote.USD.price,
      };
      res.json(simplebitcoin.price);
    } else {
      res.send('no se ha encontrado bitcoin');
    }
  }

  public ethereumCoinRoute(req: Request, res: Response, next: NextFunction) {
    const bitcoin = this.pricesArray.find((elto) => {
      return elto.slug === 'ethereum';
    });
    console.log(bitcoin);
    if (bitcoin) {
      const simplebitcoin: ISimpleCoin = {
        id: bitcoin.id,
        name: bitcoin.slug,
        price: bitcoin.quote.USD.price,
      };
      res.json(simplebitcoin.price);
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
