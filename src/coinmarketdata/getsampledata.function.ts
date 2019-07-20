import fs from 'fs';
import path from 'path';

import IDataCoin, {IresponseDataCoin} from './datacoin.interface';
import ISimpleCoin from './simplecoin.interface';

import {IResp} from '../modelos/responsesimple.interface';

const sampleDataFile = fs.readFileSync(path.join(__dirname, './samplecurrencylisting.json'));

const sampleDataObject: IresponseDataCoin = JSON.parse(sampleDataFile.toString());

const getSampleData = (): IResp => {

    // convierto la respuesta en una matriz
    // más simple
    sampleDataObject.status.timestamp = new Date();

    const simpleArrayCoins = new Array<ISimpleCoin>();

    sampleDataObject.data.forEach((coin) => {
        const newPrice = Math.round((coin.quote.USD.price * Math.random()) * 100) / 100;
        simpleArrayCoins.push({
            id: coin.id,
            name: coin.slug,
            price: newPrice,
        });
    });

    return {
        data: simpleArrayCoins,
        status: sampleDataObject.status,
    };

};

export default getSampleData;
