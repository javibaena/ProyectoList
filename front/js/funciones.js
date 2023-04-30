const formulario = document.querySelector("form");
const inputTexto = document.querySelector("form input:first-child");
const contenedor = document.querySelector(".tareas");

//buscar las tareas en la BBDD
ajax("GET","/api-todo").then(tareas => {
    tareas.forEach(tarea => {
        tarea.terminada = !!tarea.terminada;
        new Tarea(tarea.id,tarea.tarea,tarea.terminada,contenedor);
    });
});


//crear tareas (añadir tareas a la BBDD)
/* si hacemos click en el boton crear tarea, primero evitamos que se realice 
su funcion por defecto y a continuacion establecemos una condcion: si el contenido
del texto no está vacio, es decir, el usuario ha escrito algo, se enviara a la bbaa  y creara una nueva tarea */
formulario.addEventListener("submit",evento => {
    evento.preventDefault();
    
    if(inputTexto.value.trim() != ""){
        //crear la TAREA
        ajax("POST","/api-todo",{ tarea : inputTexto.value.trim() })
        .then(({resultado,id}) => {
            if(resultado == "ok"){
                new Tarea(id,inputTexto.value.trim(),false,contenedor);
                return inputTexto.value = "";
            }
            console.log("..error al usuario");
        });
    }
    
});










/* const formulario = document.querySelector("form");
const inputTexto = document.querySelector("form input:first-child");
const contenedor = document.querySelector(".tareas");

//buscar las tareas en la BBDD
ajax("GET","/api-todo").then(tareas => {
    tareas.forEach(tarea => {
        tarea.terminada = !!tarea.terminada;
        new Tarea(tarea.id,tarea.tarea,tarea.terminada,contenedor);
    });
});


//crear tareas (añadir tareas a la BBDD)
formulario.addEventListener("submit",evento => {
    evento.preventDefault();
    
    if(inputTexto.value.trim() != ""){
        //crear la TAREA
        ajax("POST","/api-todo",{ tarea : inputTexto.value.trim() })
        .then(({resultado,id}) => {
            if(resultado == "ok"){
                new Tarea(id,inputTexto.value.trim(),false,contenedor);
                return inputTexto.value = "";
            }
            console.log("..error al usuario");
        });
    }
    
});



 */