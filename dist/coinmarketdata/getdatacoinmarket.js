"use strict";
/* Example in Node.js ES6 using request-promise */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_1 = __importDefault(require("request-promise"));
var callSample = function () {
    var requestOptions = {
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
    };
    return request_promise_1.default(requestOptions);
};
exports.default = callSample;
