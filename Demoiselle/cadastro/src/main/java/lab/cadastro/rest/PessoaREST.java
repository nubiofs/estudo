package lab.cadastro.rest;

import javax.validation.constraints.Size;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.gov.frameworkdemoiselle.transaction.Transactional;
import br.gov.frameworkdemoiselle.util.ValidatePayload;

@Path("pessoa")
public class PessoaREST {
	
	private Logger LOGGER = LoggerFactory.getLogger(PessoaREST.class);

	/**
	 *
	 * - Exemplo de utilização com Postman (status 204):
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoa
	 * Method: POST
	 * Content-Type: application/json
	 * Payload Raw: o seguinte conteúdo:
	 * {
	 *     "nome" : "John Malkovich",
	 *     "email" : "john.malkovich@gmail.com",
	 *     "telefone" : "(71) 1234-5678"
	 * }
	 *
	 * - Exemplo de utilização com Postman (status 422):
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoa
	 * Method: POST
	 * Content-Type: application/json
	 * Payload Raw: o seguinte conteúdo:
	 * {
	 *     "nome" : "John Malkovich",
	 *     "email" : "john.malkovich_gmail.com",
	 *     "telefone" : "(71) 1234-5678"
	 * }
	 *
	 * Com (mensagens de validação):
	 *  
	 *  Request payload
	 * [
	 *	    {
	 *	        "property" : "email",
	 *	        "message" : "não é um endereço de e-mail"
	 *	    }
	 * ]
	 * 
	 * 
	 */
	@POST
	@ValidatePayload
	@Consumes("application/json")
	@Transactional
	public void inserir(Pessoa p){
		LOGGER.info("Pessoa (nome="+p.nome + ", email="+p.email+")");
	}
	
	public static class Pessoa {
		
		@NotEmpty
		@Size(min=3, max=50)
		public String nome;
		
		@Email
		@NotEmpty
		@Size(max=255)
		public String email;
		
		@Size(max=15)
		public String telefone;
		
	}
	
}
