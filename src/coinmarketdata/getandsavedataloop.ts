import {interval} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import getData$ from '../coinmarketdata/getdata.function';
import CoinsInterf from '../dbmodels/coins-responses';

const getAndSaveDataLoop = () => {
  interval(6000)
  .pipe(
    switchMap(() => getData$()),
    switchMap((dataCoinsResponse) => CoinsInterf.insertOne(dataCoinsResponse)),
  )
  .subscribe((result) => {
      // console.log('result de insertar la nueva response: ', result.insertedId);
  });

};

export default getAndSaveDataLoop;
