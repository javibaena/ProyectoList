const mysql = require("mysql2/promise");
const { createConnection } = require("mysql2");



/* configuramos la conexion con la bbaa, concretamente
con la tabla login_node, permitira guardar informacion sobre los usuarios */

/*const conexeionUsarios = createConnection({
    host: "http://localhost:8888/phpMyAdmin5/index.php?route=/database/structure&db=login_node",
    port: 8889,
    user:"root",
    password:"root",
    database:"login_node"
}) */

/* con el metodo connect realizamos la conexion y compramos si hay algún error o no */

/*conexeionUsarios.connect((error)=>{
  if(error){
    throw error;
  }else{
    console.log("la conexion funciona")
  }
}) */


/* configuramos la conexion con la bbaa, concretamente
con la tabla tareas, permitira guardar informacion sobre las tareas*/

/* en este caso la conexion es diferente, empleamos una promesa, es decir, esperamos que se establezca
la conexion para acontinuaciuon lanzar un callback que contenga la conexion, lo que nos permitira
poder emplearla en las siguientes funciones y aseguranos de la conexnion se haya establecido antes de realizar cualquier acción*/
function conectar(){
    return new Promise(async callback => {
        try{
            let conexion = await mysql.createConnection({
                 host: "http://localhost:8888/phpMyAdmin5/index.php?route=/database/structure&db=Tareas",
                 port: 8889,
                 user:"root",
                 password:"root",
                 database:"Tareas"
            });
            
        callback([null,conexion]);//[error,conexion]3
            
        }catch(error){
            callback([error]);
        }
    });
}
/* funcion leer, le pasamos el id de la tarea, esperamos que se realizce la conexion,
si no hay error, podemos hacer una consulta de la tarea con la id seleccionanda en la base de datos, cortamos la cnonexion
y enviamos los resultados*/
function leer(id){
    return new Promise(async callback => {
        let [error,conexion] = await conectar();
        if(!error){
              /* texto de la cunsulta */
            let consulta = `SELECT * FROM Tareas ${id ? "WHERE id = ? " : ""}`;
          /* hacemos la consulta */
            let [resultado] = await conexion.query(consulta,id ? [id] : null); 
            conexion.close();
            callback([null,resultado]);
        }else{
            callback([{ error : "error en base de datos" }]);
        }
    });
}

/* es semajante a la anterior funcion con la diferencia de que en estas estamos indicandos 
que inscriba algo en la base de datos, en lugar de realizar una consulta */
function crear(tarea){
    return new Promise(async callback => {
        let [error,conexion] = await conectar();
        if(!error){
            let [resultado] = await conexion.query("INSERT INTO  Tareas(tarea) VALUES(?)", [tarea]);
            conexion.close();
            callback([null,resultado]);
        }else{
            callback([{ error : "error en base de datos" }]);
        }
    });
}
/* con esta funcion podemos actualizar el estado de nuestra  tarea en labbaa */
function actualizar(id){
    return new Promise(async callback => {
        let [error,conexion] = await conectar();
        if(!error){
            let [resultado] = await conexion.query("UPDATE Tareas SET terminada = NOT terminada WHERE id = ?", [id]);
            conexion.close();
            callback([null,resultado]);
        }else{
            callback([{ error : "error en base de datos" }]);
        }
    });
}
/* con esta funcion podemos actualizar el texto de nuestra tarea en la bbaa */
function actualizarTexto(id,tarea){
    return new Promise(async callback => {
        let [error,conexion] = await conectar();
        if(!error){
            let [resultado] = await conexion.query("UPDATE Tareas SET tarea = ? WHERE id = ?", [tarea,id]);
            conexion.close();
            callback([null,resultado]);
        }else{
            callback([{ error : "error en base de datos" }]);
        }
    });
}
function borrar(id){
    return new Promise(async callback => {
        let [error,conexion] = await conectar();
        if(!error){
            let [resultado] = await conexion.query("DELETE from Tareas WHERE id= ?", [id]);
            conexion.close();
            callback([null,resultado]);
        }else{
            callback([{ error : "error en base de datos" }]);
        }
    });
}


/* exportamos nuestras funciones que importaremos en el fichero index.js */
module.exports ={conexeionUsarios,leer,crear,actualizar, borrar,actualizarTexto};
