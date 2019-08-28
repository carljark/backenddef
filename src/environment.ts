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
    emailto: string;
    timeAmount: number;
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
        emailto: 'godoy@archrog.localdomain',
        timeAmount: 10,
        urlServer: 'localhost',
    },
    production: {
        databaseConfig: {
            database: 'backenddef',
            host: 'mongo',
            password: 'password',
            user: 'user',
        },
        emailto: 'dev-test@team.bit2me.com',
        timeAmount: 100,
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
