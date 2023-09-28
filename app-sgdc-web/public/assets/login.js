async function logar()
{
  const url = "localhost:8080/login";

  console.log(url);

  const retorno = await fetch(url, {method:"POST", body:{usuario:$("#inputUsuario").value, senha:$("#inputUsuario").value}});
}
