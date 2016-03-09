/**
 * O controller processa e responde a eventos, geralmente ações do usuário e 
 * invoca mudanças no model e também na view.
 */
$(function() {

	$("form")
			.submit(
					function(event) {

						/* Limpa as mensagens de erro */
						$("#global-message").removeClass(
								"alert-danger alert-success").empty().hide();
						$(".text-danger").parent().removeClass("has-error");
						$(".text-danger").hide();

						event.preventDefault();

						var pessoa = {
							nome : $("#nome").val(),
							email : $("#email").val(),
							telefone : $("#telefone").val()
						};

						PessoaProxy.inserir(pessoa).done(inserirOk).fail(
								inserirFalhou);

					});

});

function inserirOk(data, textStatus, jqXHR) {
	console.log("(inserirOk) Status: " + jqXHR.status);
	console.log("(inserirOk) Location: " + jqXHR.getResponseHeader('Location'));
	$("#global-message").addClass("alert-success").text(
			"Pessoa com id = " + data + " criado com sucesso.").show();
}

function inserirFalhou(request) {
	
	console.log("(inserirFalhou) Status: " + request.status);
	
	switch (request.status) {
	case 422:
		$($("form input").get().reverse()).each(function() {
			var id = $(this).attr('id');
			var message = null;

			$.each(request.responseJSON, function(index, value) {
				if (id == value.property) {
					message = value.message;
					return;
				}
			});

			if (message) {
				console.log($("#" + id).parent());
				$("#" + id).parent().addClass("has-error");
				$("#" + id + "-message").html(message).show();
				$(this).focus();
			} else {
				$("#" + id).parent().removeClass("has-error");
				$("#" + id + "-message").hide();
			}
		});
		break;

	default:
		$("#global-message").addClass("alert-danger").text(
				"Erro ao cadastrar pessoa.").show();
		break;
	}
}