const myBton = document.getElementById("myButton");

let variablelet = "Variable declarada con let";

const variableConst = "Variable declarada con const";
var Hola = "Variable declarada con var";

// myBton.addEventListener("click", MyObject.Hola);

// function saludar(){
//     let variablelet 
//     alert(variablelet);
// }


// function saludar2(){
//     let variablelet ;
//     alert(variablelet);
// }

// const MyObject = {
//     propiedad1:"Valor de la propiedad 1",
//     edad:23,
//     Hola: function(){
//         alert("Hola, soy un Hola")
//     }

// }



const objeto = {nombre: "Cebrian", edad : 19};

const jsonString = JSON.stringify(objeto);
alert(jsonString);


const nuevoObjeto = JSON.parse(jsonString);
alert(nuevoObjeto.nombre);