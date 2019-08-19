import * as fs from 'fs';
import * as path from 'path';

const copyToDist = (file: string) => {
    fs.copyFile(path.join(__dirname, './', file), path.join(__dirname, './dist', file), (err) => {
        if (err) {
            console.log('err: ', err);
        }
        console.log(`copia realizada de ${file}`);
    });
};

copyToDist('index.html');
copyToDist('styles.css');
