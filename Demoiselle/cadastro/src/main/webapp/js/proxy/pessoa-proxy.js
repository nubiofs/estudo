/**
 * O proxy é usado para acessar os serviços REST disponibilizados no servidor
 * back-end.
 */
var PessoaProxy = {

	url : "api/pessoa",

	inserir : function(_pessoa) {
		return $.ajax({
			type : "POST",
			url : this.url,
			data : JSON.stringify(_pessoa),
			contentType : "application/json"
		});
	},
	
	obter : function(id){
        return $.ajax({
            type : "GET",
            url : this.url + "/" + id
        });
    }

};
