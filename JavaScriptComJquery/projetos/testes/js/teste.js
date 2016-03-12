function valorMudou() {
    $("#valor").val = " ";
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
