import { ObjectId } from 'bson';
import { concatMap, switchMap } from 'rxjs/operators';
import modelo from '../coins-responses';

/* modelo.getLast()
.subscribe((resp) => {
  console.log(resp);
}); */

modelo.getLast()
.pipe(
  switchMap((resp) => modelo.getByMongoId(new ObjectId(resp._id))),
  switchMap((respm) => modelo.getOne({'status.timestamp': respm.status.timestamp})),
)
.subscribe((respOne) => {
  console.log('getlast-->getbymongoid-->getone --> ok', respOne._id);
});
