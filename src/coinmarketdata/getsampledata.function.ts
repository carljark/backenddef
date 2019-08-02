import fs from 'fs';

import IDataCoin, {IresponseDataCoin} from './datacoin.interface';
import ISimpleCoin from './simplecoin.interface';

const sampleDataFile = fs.readFileSync('./samplecurrencylisting.json');

const sampleDataObject: IresponseDataCoin = JSON.parse(sampleDataFile.toString());

const getSampleData = (): ISimpleCoin[] => {

    // convierto la respuesta en una matriz
    // más simple

    const simpleArrayCoins = new Array<ISimpleCoin>();

    sampleDataObject.data.forEach((coin) => {
        simpleArrayCoins.push({
            id: coin.id,
            name: coin.slug,
            price: coin.quote.USD.price,
        });
    });

    return simpleArrayCoins;

};

export default getSampleData;
