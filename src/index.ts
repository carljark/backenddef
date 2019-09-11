import express from 'express';
import http from 'http';
import config from './environment';
import Server from './server/server';

const mode = process.env.NODE_ENV;

// if (mode === 'development') {
console.log('servidor auxiliar');
const apphttp = express();
apphttp.use((req, res, next) => {
    res.redirect(config.urlServerRedirect);
    next();
});
const serverhttp = http.createServer(apphttp);
const httpPort = 8080;
serverhttp.listen(httpPort, () => {
    console.log(`http escuchando en ${httpPort}`);
});
// }

const port = 8443;
const server = Server.init(port);
server.start(() => {
    console.log(`servidor escuchando en el puerto ${port}`);
});
