/**
 * O controller processa e responde a eventos, geralmente ações do usuário e 
 * invoca mudanças no model e também na view.
 */
$(function() {

	PessoaProxy.buscar().done(buscarOk);

	$("#buscar").on("click", function(){
        var filtro = $("#filtro").val();
        PessoaProxy.buscar(filtro).done(buscarOk);
    });
	
	$("th").on("click", function(){
        var ordem = $(this).data("column");
        var filtro = $("#filtro").val();
        PessoaProxy.buscar(filtro, ordem).done(buscarOk);
    });
	
});

function buscarOk(pessoas) {

	var table = document.getElementsByTagName("table")[0];

	var body = document.getElementsByTagName("tbody")[0];
	$(body).empty();

	var foot = document.getElementsByTagName("tfoot")[0];
	$(foot).empty();

	if (pessoas) {
		for (var i = 0; i < pessoas.length; i++) {
			var pessoa = pessoas[i];
			var row = document.createElement('tr');

			var cellId = document.createElement('td');
			var textId = document.createTextNode(pessoa.id);
			cellId.appendChild(textId);

			var cellNome = document.createElement('td');
			var textNome = document.createTextNode(pessoa.nome);
			cellNome.appendChild(textNome);

			var cellEmail = document.createElement('td');
			var textEmail = document.createTextNode(pessoa.email);
			cellEmail.appendChild(textEmail);

			var cellTelefone = document.createElement('td');
			var textTelefone = document.createTextNode(pessoa.telefone);
			cellTelefone.appendChild(textTelefone);

			row.appendChild(cellId);
			row.appendChild(cellNome);
			row.appendChild(cellEmail);
			row.appendChild(cellTelefone);

			body.appendChild(row);
		}
	} else {
		if (!foot) {
			foot = document.createElement('tfoot');
		}
		var emptyRow = document.createElement('tr');
		var emptyCell = document.createElement('td');
		var noRegisterText = document
				.createTextNode("Nenhum registro retornado");
		emptyCell.appendChild(noRegisterText);
		emptyCell.setAttribute("colspan", 4);
		emptyRow.appendChild(emptyCell);
		foot.appendChild(emptyRow);
		table.appendChild(foot);
	}
}