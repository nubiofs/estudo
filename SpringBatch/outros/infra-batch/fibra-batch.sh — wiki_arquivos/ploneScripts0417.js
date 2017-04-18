
/* - FontSwitcher.js - */
// https://wiki.serpro/portal_javascripts/FontSwitcher.js?original=1
function zoom(arg){var valorInicial=1,novoValor=1,incremento=0.1,novoValor;if(arg=='+'){valorInicial=1,novoValor=1,incremento=0.4
novoValor=(arg=='+')?novoValor+incremento:valorInicial;document.getElementById("portal-columns").style.fontSize=novoValor+'em'}
else{if(arg=='-'){valorInicial=1,novoValor=1,incremento=-0.1
novoValor=(arg=='-')?novoValor+incremento:valorInicial;document.getElementById("portal-columns").style.fontSize=novoValor+'em'}
else{novoValor=(arg=='+')?novoValor+incremento:valorInicial;document.getElementById("portal-columns").style.fontSize=novoValor+'em'}}}

