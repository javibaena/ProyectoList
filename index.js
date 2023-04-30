const express = require ("express"); //modulo express
const session = require("express-session") /* modulo session */
const bcryptjs = require("bcryptjs");
const bodyParser = require("body-parser");//modulo body-parser
/* importamos funciones */
const {conexeionUsarios     ,leer,crear,actualizar, borrar, actualizarTexto} = require ("./db/configuracion");
const servidor = express(); //servidor
servidor.set("view engine","ejs");/* motor de plantillas */
const msgError = {resultado : "error"}; //mensaje error
/* directorio public */
servidor.use("/resources", express.static("public"));
servidor.use(express.static("public")); 
servidor.use("/resources", express.static(__dirname + "/public"))


/* para convertir json a objeto que llegen desde las conexiones */
servidor.use(bodyParser.json());
/* para capturar datos del formulario */
servidor.use(bodyParser.urlencoded({extended: true}));
//definimos el puerto
const PORT = 3030; 





servidor.use(session({
    secret: "1234",/* encriptacion */
    resave: true, /* sobreescribir cambios dentro de la sesion */
    saveUninitialized : false /* cualquier sesion donde existan cambios, no se guarda */
}));/* en el momento que alguien se meta en nuestra pg nuestra, express introducirá un cookie en 
el navegador/ordenador del usuario */

/* establecemos las rutas */ //ruta para el index
servidor.get("/",(req, res)=>{
    res.render("index.ejs", {msg: "mensaje desde mpde "});
});
//ruta login
servidor.get("/login",(req, res)=>{
    res.render("login.ejs")
});
//ruta registro
servidor.get("/register",(req, res)=>{
    res.render("registro.ejs")
});
//ruta home
servidor.post("/home",(req,res)=>{
    res.render("home.ejs")
})
//crear usuario
servidor.post("/register", async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const password = req.body.password;
    let passwoprdHaash = await bcryptjs.hash(password,8)
    conexeionUsarios.query("INSERT INTO usuarios SET ?", 
    {user:user, name : name, password: passwoprdHaash},
    async (error, resulultado)=>{
        if(error){
            console.log(error);
        }else{
          res.render("login")
        }    
    })
})
//acceso al home
servidor.post("/auth", async(req, res)=>{
    const  user = req.body.user;
    const password = req.body.password;
    let passwoprdHaash = await bcryptjs.hash(password,8);
    if(user && password){
        conexeionUsarios.query("SELECT * FROM usuarios WHERE user,password ?", [user],
        async(error, resultado) =>{
            if(resultado == 0){
                res.send("usuario yo passwoprd incorrecta");
            }
            res.render("home.ejs")
        })
    }
})
//ruta logout corta la sesion
servidor.get("/logout", (req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/")
    })
})


//ruta con el front
servidor.use("/app", express.static("./front")); 
//ruta api-todo
servidor.route("/api-todo")

.get(async(req, res) =>{
   let [error, tareas] = await leer();
   res.json(!error ? tareas : msgError);
})



/* llega  un peticion post a nuestra APÎ lo pormeor que hacemos es extraer el body, con la el body.parser
luego preguntamos si exite, si exite , hacemos la consulta, si hubo un error en la bbaa aterrizamos en mensaje error
si todo va ok, informamos con el resultado.consulta en ok y el id de la consulta, si no funciona con pasa a resultaConsulta con su valor
por defecto (ko)


*/





















.post(async(req, res) =>{
    let {tarea} = req.body;
    console.log(tarea)  /* el objeto que ha parseado body-parser */

    /*  con esta condicional si tenemos algo y no son espaciods en blaco, crearemos nuestra tarea */
    if(tarea && tarea.trim() !=""){
        let = [error, resultado] = await crear(tarea.trim());

        if(!error){

            /* si la prodiedad affectedRows del objeto resultSetHeader que generara nuestra consulta
            es mayor 0 es que efectivamente creamos algo en nuestra bbaa  */
            let = resultadoConsulta = {resultado : "ko"};
            if(resultado.affectedRows > 0){
                resultadoConsulta.resultado = "ok";
                resultadoConsulta.id = resultado.insertId;
            }
            return res.json(resultadoConsulta);
        }
            return res.send("..hicimos la consulta")
    }
    /*  */
    res.json(msgError);
})
.put(async(req, res) =>{
   let {id, operacion, tarea} = req.body;
   /* comprabamos primero que exista id y luego que la podamos convertir a numero entero
    Esto lo hacemos para asegurar que recibmos un dato de tipo number y no recibimos x ejemplo un string...si no error
        expresion regulaer, que sea un digito entre 1 y 11 y tiene que exitir y una vez que exite que 
        sea o 1 o 2
    ahora comprabamos si id es 1 o es 2....si es alguno de los dos ok
   */
   if(id && /^[0-9]{1,11}$/.test(id) && operacion && /^(1|2)$/.test(operacion)){

        let operaciones = [actualizar,actualizarTexto];

        let valido = true;
        /* esto es importante, hay que comentarlo */
        operacion = parseInt(operacion)
        if(parseInt(operacion) == 2){
            valido = tarea && tarea != "";
        }
        if(valido){
           let [error,resultado]= await operaciones[operacion-1](id,operacion == 2? tarea : null);
           if(!error){
            return res.json({resultado : resultado.changedRows > 0 ? "ok" : "ko"});
           }
        }
         
   }
   /* opcion por defecto */
    res.json(msgError)
   
})
/* esto es una sola, que puede ser para cada una */

servidor.get("/api-todo/:id([0-9]{1,11})", async (req,res)=>{
    let [error, tareas] = await leer(req.params.id);
   res.json(!error ? tareas : msgError);
});

servidor.delete("/api-todo/borrar/:id([0-9]{1,11})",async (req,res)=>{
    let [error, resultado] = await borrar(req.params.id);
    if(!error){
        return res.json({resultado : resultado.affectedRows > 0 ?"ok" : "ko"});
    }


    /* opcion por defecto */
    res.json(msgError);
    
});


/* si hay algun error va a aterrizar en el middleware donde este nuestro error */
servidor.use((error,req, res, next) => {
    console.log(error)
    res.json(msgError)
    /* json para que enviar nuestro obejto errror como repsuesta */

})

servidor.listen(PORT, ()=>{

    console.log(`el servidor esta escuchando en el puerto ${PORT}`)
});

