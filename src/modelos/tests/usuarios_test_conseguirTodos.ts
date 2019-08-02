import modelo from '../usuarios';
console.log('coleccion usuarios: ')
modelo.buscarPorAtributos({})
.subscribe(result => {
  // console.log('datos buscados: \n', datos);
  console.log('conseguirTodos --> ok', result);
})

