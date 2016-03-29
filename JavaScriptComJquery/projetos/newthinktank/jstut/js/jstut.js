
var yourName = prompt("What is your name?");

if (yourName != null) {
    var msg = "Hello " + yourName + " !";
    document.getElementById("sayHello")
        .innerHTML = msg;
}

//comando ok, pois "msg" não está em um escopo de função!
console.log("ver: " + msg);

/*
function onDocumentLoad() {

    var yourName = prompt("What is your name?");

    if (yourName != null) {
        //Para o comando "console.log("consegui? " + msg);" 
        //abaixo vai dar:
        //"ReferenceError: msg is not defined""
        var msg = "Hello " + yourName + " !";
        document.getElementById("sayHello")
            .innerHTML = msg;
    }
    
}

window.onload = onDocumentLoad;

console.log("consegui? " + msg);
*/