import * as fs from 'fs';
import * as path from 'path';

const copyToDist = (dirOrig: string, dirDest: string, file: string) => {
    fs.copyFile(path.join(__dirname, dirOrig, file), path.join(__dirname, dirDest, file), (err) => {
        if (err) {
            console.log('err: ', err);
        }
        console.log(`copia realizada de ${file}`);
    });
};

copyToDist('./src/coinmarketdata', './dist/coinmarketdata', 'samplecoinsresponse.json');
copyToDist('./src/server', './dist/server', 'fullchain.pem');
copyToDist('./src/server', './dist/server', 'privkey.pem');
// copyToDist('styles.css');
