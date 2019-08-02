import Server from './server/server';

const port = 8000;
const server = Server.init(port);
server.start(() => {
    console.log(`servidor escuchando en el puerto ${port}`);
});
