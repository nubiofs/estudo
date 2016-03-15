/**
 * O proxy é usado para acessar os serviços REST disponibilizados no servidor
 * back-end.
 */
var PessoaProxy = {

	url : "api/pessoa",

	inserir : function(pessoa) {
		return $.ajax({
			type : "POST",
			url : this.url,
			data : JSON.stringify(pessoa),
			contentType : "application/json"
		});
	},
	
	atualizar : function(id, pessoa){
        return $.ajax({
            type : "PUT",
            url : this.url + "/" + id,
            data : JSON.stringify(pessoa),
            contentType : "application/json"
        });
    },
	
    atualizarParcial : function(id, pessoa){
        return $.ajax({
            type : "PATCH",
            url : this.url + "/" + id,
            data : JSON.stringify(pessoa),
            contentType : "application/json"
        });
    },
    
	obter : function(id){
        return $.ajax({
            type : "GET",
            url : this.url + "/" + id
        });
    },
    
    buscar : function(filtro, ordem){
        return $.ajax({
            type : "GET",
            url : this.url,
            data : {"filtro" : filtro, "ordem" : ordem}
        });
    }

};
