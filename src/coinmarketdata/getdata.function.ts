import fs from 'fs';
import path from 'path';

import { IresponseDataCoin } from '../interfaces/response-coinmarket.interface';
import ISimpleCoin from '../interfaces/simplecoin.interface';

import { IResp } from '../interfaces/response-simplified.interface';

import getDataCoinMarket from './getdatacoinmarket';

import {mode} from '../environment';

import {Observable} from 'rxjs';

let getLastCoinsResponse: () => Observable<IResp>;

if (mode === 'production') {
  getLastCoinsResponse = (): Observable<IResp> => {
    return new Observable((ob) => {
      getDataCoinMarket()
      .then((response: IResp) => {
        ob.next(response);
      })
      .catch((err) => {
        console.log('API call error: ', err.message);
      });
    });
  };
} else {
    const sampleCoinsResponseFile = fs.readFileSync(path.join(__dirname, './samplecoinsresponse.json'));

    const sampleDataObject: IresponseDataCoin = JSON.parse(sampleCoinsResponseFile.toString());

    getLastCoinsResponse = (): Observable<IResp> => {
      return new Observable<IResp>((ob) => {
        sampleDataObject.status.timestamp = new Date();
        const simpleArrayCoins = new Array<ISimpleCoin>();
        sampleDataObject.data.forEach((coin) => {
          const aleatorio = 0.8 + (1.2 - 0.8) * Math.random();
          const newPrice =
            Math.round(coin.quote.USD.price * aleatorio * 100) / 100;
          simpleArrayCoins.push({
            id: coin.id,
            name: coin.slug,
            price: newPrice,
          });
        });
        ob.next({
          data: simpleArrayCoins,
          status: sampleDataObject.status,
        });
      });
    };
}

export default getLastCoinsResponse;
