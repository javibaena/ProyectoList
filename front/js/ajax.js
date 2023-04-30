function ajax(metodo,url,datos){
    let configuracion = {
        method : metodo
    }
    if(metodo == "POST" || metodo == "PUT"){
        configuracion.body = JSON.stringify(datos);
        configuracion.headers = { "Content-type" : "application/json" };
    }
    return fetch(url,configuracion).then(respuesta => respuesta.json());
}