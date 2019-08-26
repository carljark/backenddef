import { Observable } from 'rxjs';
import config from './environment';

import ISimpleCoin from './simplecoin.interface';

export class GetCurrenciesService {

    public getLastCurrencies(): Observable<ISimpleCoin[]> {
        return new Observable<ISimpleCoin[]>((ob) => {
            fetch(`${config.urlServer}/api/coins`)
              .then((result) => {
                return result.json();
              })
              .then((myjson: ISimpleCoin[]) => {
                if (myjson.length) {
                    console.log('myjson: ', myjson);
                    ob.next(myjson);
                    ob.complete();
                }
              });
        });
    }
}
