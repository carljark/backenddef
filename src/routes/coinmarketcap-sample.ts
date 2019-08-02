/* Example in Node.js ES6 using request-promise */

import rp from 'request-promise';

import fs from 'fs';
import ISimpleCoin from './simplecoin.interface';

const callSample = (): rp.RequestPromise => {
    const requestOptions = {
        gzip: true,
        /* headers: {
            'X-CMC_PRO_API_KEY': 'ef8b9fb0-3bdc-47c1-89d0-d608f6757d03',
        }, */
        headers: {
            'X-CMC_PRO_API_KEY': 'a78f5123-7c77-4c72-81f0-ca43b9ab14e0',
        },
        json: true,
        method: 'GET',
        qs: {
            convert: 'USD',
            limit: '10',
            start: '1',
        },
        uri: 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        // uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    };

    return rp(requestOptions);

};

export default callSample;
