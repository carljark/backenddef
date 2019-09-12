import db from '../db.factory';

db.subscribe((d) => {
  console.log('conectado: ');
  d.db.listCollections({} , {nameOnly: true})
  .toArray((err, colecciones) => {
    console.log('collections: ', colecciones);
  });
});
