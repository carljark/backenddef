import modelo from '../coins-responses';
modelo.getAll()
.subscribe((result) => {
  // console.log('datos buscados: \n', datos);
  console.log('getAll --> ok', result.length);
});
