import modelo from '../coins';
console.log('coleccion responses: ');
modelo.buscarPorAtributos({})
.subscribe((result) => {
  // console.log('datos buscados: \n', datos);
  console.log('conseguirTodos --> ok', result);
});
