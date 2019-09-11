import {argv} from 'process';
import {CoinDoc} from '../../modelos/coin.class';
import db from '../db';

db.delAll('responses')
.subscribe((result) => {
    console.log('resultado del borrado: ', result.result);
});
