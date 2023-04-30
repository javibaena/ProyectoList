
    
/* creamos la claase tarea */
class Tarea{
    constructor(id,textoTarea,estado,contenedor){
        //id -> número | textoTarea --> string | estado --> boolean | contenedor --> nodo DOM
        this.id = id;
        this.textoTarea = textoTarea;
        this.estado = estado;//representa si la tarea está o no terminada
        this.elementoDOM = null;//representa la tarea en el DOM
        this.editando = false;//representa si la tarea está o no siendo editada
        this.crearTarea(contenedor);
    }
    crearTarea(contenedor){
        //crear DOM
        this.elementoDOM = document.createElement("div");
        this.elementoDOM.classList.add("tarea");
        //texto editable de la tarea
        let textoTarea = document.createElement("h2");
        textoTarea.classList.add("visible");
        textoTarea.innerHTML = this.textoTarea;
        let inputTarea = document.createElement("input");
        inputTarea.setAttribute("type","text");
        inputTarea.setAttribute("value",this.textoTarea);
        //botones
        //botón editar
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.innerHTML = "editar";
        botonEditar.addEventListener("click", () => {
            this.editarTarea();
        });
        //botón borrar
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton");
        botonBorrar.innerHTML = "borrar";
        botonBorrar.addEventListener("click", () => {
            this.borrarTarea();
        });



        //botón estado
       let botonE = document.createElement("button");
        let botonInidicadorEstado = document.createElement("div");
        botonInidicadorEstado.classList.add("botoncin");
        botonE.classList.add("boton");
        botonE.innerHTML = "Hecha";
        botonE.className = `boton ${this.estado ? "ok" : ""}`;
        botonE.addEventListener("click", () => {
            this.cambiarE().then(({resultado}) => {
                if(resultado == "ok"){
                    /* textoTarea.classList.toggle("ok");  */
            /*          botonInidicadorEstado.classList.toggle("ok"); */
                     botonE.classList.toggle("ok"); 
                }else{
                    console.log("mostrar error al usuario");
             }
           });
     }); 

        
        //añadir elementos al DOM
        this.elementoDOM.appendChild(textoTarea);
        this.elementoDOM.appendChild(inputTarea);
        this.elementoDOM.appendChild(botonEditar);
        this.elementoDOM.appendChild(botonBorrar);
        this.elementoDOM.appendChild(botonE);
      /*   this.elementoDOM.appendChild(botonInidicadorEstado); */
        contenedor.appendChild(this.elementoDOM);
    }
    async editarTarea(){
        if(this.editando){
            /* si el elemento que estamos editando no es igual a vacio o no el igual al anterior elemento, procemos a generar un nuevo elemento "datos" */
            if(this.elementoDOM.children[1].value.trim() != "" && this.elementoDOM.children[1].value.trim() != this.textoTarea){
                let datos = {
                    id : this.id,
                    operacion : 2,
                    tarea : this.elementoDOM.children[1].value.trim()
                };
                let {resultado} = await ajax("PUT","/api-todo",datos); //pasamos los datos del texto editado vie ajax con el metodo PUT
                if(resultado == "ok"){
                    this.textoTarea = datos.tarea;  //texto editado
                }else{
                    console.log("mostrar error al usuario");
                }
            }
            this.elementoDOM.children[0].innerHTML = this.textoTarea;
            this.elementoDOM.children[1].value = this.textoTarea;
            this.elementoDOM.children[1].classList.remove("visible");//quita la clase al INPUT
            this.elementoDOM.children[0].classList.add("visible");//añade la clase al H2
            this.elementoDOM.children[2].innerHTML = "editar"; //lo que aparecerá en el boton "editar"
            this.editando = false;  
        }else{
            //activar la posibilidad de editar
            this.elementoDOM.children[0].classList.remove("visible");//quita la clase al H2
            this.elementoDOM.children[1].classList.add("visible");//añade la clase al INPUT
            this.elementoDOM.children[2].innerHTML = "guardar"; //lo que aparecerá en el boton "guardar"
            this.editando = true;
        }
    }
    cambiarE(){
        return ajax("PUT","/api-todo",{ id : this.id , operacion : 1});
    }
    
    async borrarTarea(){
        let {resultado} = await ajax("DELETE",`/api-todo/borrar/${this.id}`);
        if(resultado == "ok"){
            this.elementoDOM.remove();
        }else{
            console.log("...mostrar error a usuario");
        }
    }
}


let gif = document.querySelector("video");//selecionamos el video con el gif
let footer = document.querySelector("footer"); //seleccionamos el footer
let input = document.querySelector("input"); //seleccionamos el input
/* si clicamos en el input añadimos la clase "invislble al video y se la ponemos al footer" */
input.addEventListener("click",()=>{
gif.classList.add("invisible");
footer.classList.remove("invisible");
})
















