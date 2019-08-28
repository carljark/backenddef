
import fs from 'fs';
const privatekey = fs.readFileSync(__dirname + '/privkey.pem');
const certificate = fs.readFileSync(__dirname + '/fullchain.pem');
export const  credentials = {
  cert: certificate,
    key: privatekey,
};
