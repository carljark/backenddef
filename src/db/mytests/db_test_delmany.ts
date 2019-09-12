import { ObjectId } from 'bson';
import {argv} from 'process';
import { switchMap } from 'rxjs/operators';
import {CoinDoc} from '../../interfaces/coin.class';
import db from '../db';
import dbfactory$ from '../db.factory';

dbfactory$
.pipe(switchMap((dbfact) => db.delMany('responses', { _id: new ObjectId('5d48859072c9c707d5681d5d') })))
.subscribe((result) => {
    console.log('resultado del borrado: ', result.result);
});
