var http = require('http');
var fs = require('fs');

var server = http.createServer(function(request, response) {
    console.log("Vai ler arquivo...");
    // A constante __dirname retorna o diretório raiz da aplicação.
    fs.readFile(__dirname + '/index.html', function(err, html) {
        response.writeHeader(200, { 'Content-Type': 'text/html' });
        response.write(html);
        response.end();
    });
});

server.listen(3000, function() {
    console.log('Executando Site Pessoal...');
});