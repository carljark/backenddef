import usuarios from '../usuarios';
usuarios.borrarTodos()
.subscribe(resborrar => {
  console.log('borrarTodos --> ok', resborrar.result);
});

