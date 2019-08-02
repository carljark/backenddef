const mode = process.env.NODE_ENV;
let urlServer = '';
if (mode === 'development') {
    urlServer = 'http://localhost:8000';
} else {
    urlServer = '';
}
export default urlServer;
