import {argv} from 'process';
import {CoinDoc} from '../../interfaces/coin.class';
import db from '../db';

import { switchMap } from 'rxjs/operators';

db.delAll('responses')
.subscribe((result) => {
    console.log('resultado del borrado: ', result.result);
});
