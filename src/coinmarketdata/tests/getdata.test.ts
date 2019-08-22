import fs from 'fs';
import moment from 'moment';
import getData from '../getdata.function';

getData()
.subscribe((resp) => {
    const hourNow = moment(new Date()).format('YYYYMMDD_hhmmss');
    console.log('resp: ', resp);
    fs.writeFile(`samplecurrencylisting${hourNow}.json`, JSON.stringify(resp), (err) => {
        if (err) {
            console.log('err: ', err);
        } else {
            console.log('resultado guardado');
        }
    });
});
