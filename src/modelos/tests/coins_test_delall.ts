import usuarios from '../coins-responses';
usuarios.delAll()
.subscribe((resborrar) => {
  console.log('delAll --> ok', resborrar.result);
});
