var http = require('http');

var server = http.createServer(function(request, response) {
    
    var html = [
        '<!DOCTYPE html>',
        '<html>',
            '<head>',
                '<meta charset="utf-8" />',
                '<title>Hello World3</title>',
            '</head>',
            '<body>',
                '<p>Hello world3!</p>',
            '</body>',
        '</html>'
    ].join('');
    
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    if (request.url == "/") {
        response.write(html);
    } else if (request.url == "/bemvindo") {
        response.write("<h1>Bem-vindo :)</h1>");
    } else {
        response.write("<h1>Página não encontrada :(</h1>");
    }
    response.end();
});

server.listen(3000, function(param) {
    console.log("Servidor Hello World3 rodando...");
});