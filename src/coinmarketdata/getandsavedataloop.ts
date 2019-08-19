import {interval} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import getSampleData from '../coinmarketdata/getsampledata.function';
import CoinsInterf from '../modelos/coins-responses';
import { IResp } from '../modelos/responsesimple.interface';

const getAndSaveDataLoop = () => {
  let dataCoinsResponse: IResp;
  const getDataAndSaveInterval = interval(6000);
  getDataAndSaveInterval
  .pipe(
    switchMap((time) => {
      dataCoinsResponse = getSampleData();
      console.log('nuevos resultados: ', dataCoinsResponse);
      return CoinsInterf.insertOne(dataCoinsResponse);
    })
  )
  .subscribe((result) => {
      console.log('result de insertar la nueva response: ', result.insertedId);
  });

}

export default getAndSaveDataLoop;
