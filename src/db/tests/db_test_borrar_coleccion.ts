import {argv} from 'process';
import {CoinDoc} from '../../modelos/coin.class';
import db from '../db';

db.borrarTodos('responses')
.subscribe((result) => {
    console.log('resultado del borrado: ', result);
});
