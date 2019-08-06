import fs from 'fs';
import path from 'path';

import {IresponseDataCoin} from './datacoin.interface';

const sampleDataFile = fs.readFileSync(path.join(__dirname, './samplecurrencylisting.json'));

const sampleDataObject: IresponseDataCoin = JSON.parse(sampleDataFile.toString());

console.log('sampleDataObject: ', sampleDataObject);
