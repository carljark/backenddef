import modelo from '../coins-responses';
modelo.getLast()
.subscribe((result) => {
  // console.log('datos buscados: \n', datos);
  // console.log('getLast --> ok', result._id);
  console.log('getLast --> ok', result);
});
