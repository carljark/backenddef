export const mode = process.env.NODE_ENV;

interface IDatabaseConfig {
    database: string;
    host: string;
    password: string;
    user: string;
}

interface IConfig {
    databaseConfig: IDatabaseConfig;
    urlServer: string;
}

interface IConfigModes {
    development: IConfig;
    production: IConfig;
}

const configurations: IConfigModes = {
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

let config: IConfig;
if (mode === 'production') {
    config = configurations.production;
} else {
    config = configurations.development;
}

console.log('mode: ', mode);
console.log('config: ', config);
export default config;
