var http = require('http');
var url = require('url');

var server = http.createServer(function(request, response) {
    
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("<h1>Dados da query string</h1>");
    
    // Esse módulo "url" identifica através do retorno da função url.parser() 
    // os seguintes atributos:
    // • href: Retorna a url completa: ‘http://user:pass@host.com:8080/p/a/t/h?
    // query=string#hash’
    // • protocol: Retorna o protocolo: ‘http’
    // • host: Retorna o domínio com a porta: ‘host.com:8080’
    // • auth: Retorna dados de autenticação: ‘user:pass’
    // • hostname: Retorna o domínio: ‘host.com’
    // • port: Retorna a porta: ‘8080’
    // • pathname: Retorna os pathnames da url: ‘/p/a/t/h’
    // • search: Retorna uma query string: ‘?query=string’
    // • path: Retorna a concatenação de pathname com query string:
    // ‘/p/a/t/h?query=string’
    // • query: Retorna uma query string em JSON: {‘query’:’string’}
    // • hash: Retorna ancora da url: ‘#hash’
    //
    //console.log("result.href: "+result.href)
    //
    var result = url.parse(request.url, true);
    
    //querystrings (?nome=joao) em: "http://127.0.0.1:3000/?nome=joao"
    for (var key in result.query) {
        response.write("<h2>" + key + " : " + result.query[key] + "</h2>");
    }
    
    response.end();
    
});

server.listen(3000, function() {
    console.log('Servidor http.');
});