var fs = require('fs');

//faz uma leitura ASSíNCRONA I/O do arquivo index.html
fs.readFile('./index.html', function(erro, arquivo) {
    if (erro){
        throw erro;
    }
    console.log(arquivo.toString());
});

//faz uma leitura SíNCRONA I/O do arquivo index.html
var arquivo = fs.readFileSync('./index.html');

//Conteudo é lido antes do console.log (da linha 8)!!!
console.log(arquivo);