/*
Funcionalidade muito importante do jQuery:
Evento, chamado ready, do documento que é
executado assim que o documento
terminar de ser carregado.
*/

//Substitui a antiga forma (apenas Javascript):

function onDocumentLoad() {
// faça alguma coisa
}
window.onload = onDocumentLoad;

//
//Novas formas (com jQuery):
//

jQuery(document).ready(function() {
// faça alguma coisa
});

//ou

$(document).ready(function() {
// faça alguma coisa
});

//ou

$(function() {
// faça alguma coisa
});

//////////////

function valorMudou() {
    $("#valor").val(" ");
}

function converter() {

    var v = document.getElementById('valor');
    var c = floatToMoneyText(v.value);

    var vx= document.getElementById('show');
    vx.disabled = false;
    vx.value = c;

}

function floatToMoneyText(value) {
    var text = (value < 1 ? "0" : "") + Math.floor(value * 100);
    text = "R$ " + text;
    return text.substr(0, text.length - 2) + "," + text.substr(-2);
}

function moneyTextToFloat(text) {
    var cleanText = text.replace("R$ ", "").replace(",", ".");
    return parseFloat(cleanText);
}

//Retorna "true e msg not found" para Internet Explorer
//inferior à versão 9
if (document.getElementsByClassName == undefined) {
    //alert(document.getElementsByClassName === undefined);
    //alert("getElementsByClassName not found");
    //Implementando getElementsByClassName de document.
    //Ou melhor: utilizar o jQuery (que implementa as incompatibilidades)!!!
    document.getElementsByClassName = function(className) {
        //alert("Regozijai-vos, usuários de Internet Explorer");
        var todosElementos = document.getElementsByTagName("*");
        var resultados = [];
        var elemento;
        for (var i = 0; (elemento = todosElementos[i]) != null; i++) {
            var elementoClass = elemento.className;
            if (elementoClass &&
                elementoClass.indexOf(className) != -1) {
                resultados.push(elemento);
            }
        }
        return resultados;
    }
}