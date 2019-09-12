import { ObjectId } from 'bson';
import { switchMap, tap } from 'rxjs/operators';
import modelo from '../coins-responses';

const testGetLast = modelo.getLast()
.pipe(
  switchMap((resp) => {
    console.log('resp from getLast: ', resp);
    return modelo.getByMongoId(new ObjectId(resp._id));
  }),
  switchMap((resp) => {
    console.log('resp from getByMongoId: ', resp);
    return modelo.getOne({_id: resp._id});
  }),
  tap((resp) => console.log('resp from getOne: ', resp)),
);

export default testGetLast;
