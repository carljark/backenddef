"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mode = process.env.NODE_ENV;
var configurations = {
    development: {
        databaseConfig: {
            database: 'backenddefdev',
            host: 'localhost',
            password: 'password',
            user: 'user',
        },
        urlServer: 'localhost',
    },
    production: {
        databaseConfig: {
            database: 'backenddef',
            host: 'mongo',
            password: 'password',
            user: 'user',
        },
        urlServer: 'localhost',
    },
};
var config;
if (exports.mode === 'production') {
    config = configurations.production;
}
else {
    config = configurations.development;
}
console.log('mode: ', exports.mode);
console.log('config: ', config);
exports.default = config;
