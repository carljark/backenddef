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

copyToDist('./src/coinmarketdata', './dist/coinmarketdata', 'samplecurrencylisting20190819_114550.json');
// copyToDist('styles.css');
