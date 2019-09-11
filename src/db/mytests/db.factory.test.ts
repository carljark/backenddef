import db from '../db.factory';

db.subscribe((d) => {
  console.log('conectado: ');
  d.listCollections({} , {nameOnly: true})
  .toArray((err, colecciones) => {
    console.log('collections: ', colecciones);
  });
});
