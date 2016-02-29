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
import lab.cadastro.entity.Pessoa;
import lab.cadastro.persistence.PessoaDAO;

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
	public void inserir(PessoaBody p){
		LOGGER.info("Pessoa (nome="+p.nome + ", email="+p.email+")");
		
		Pessoa entity = new Pessoa();
        entity.setNome(p.nome);
        entity.setEmail(p.email);
        entity.setTelefone(p.telefone);

		/*
		 * Note que foi evitado a injeção da classe PessoaDAO em PessoaREST. 
		 * É uma boa decisão não atrelar o ciclo de vida do DAO ao REST. 
		 * Da forma que está feito, o DAO será criado e destruído durante a 
		 * chamada ao método inserir.
		 * Imagine agora essa classe REST com 4 métodos, sendo que cada um 
		 * precisasse invocar um DAO diferente. Ao injetar os 4 DAOs como atributo 
		 * da classe REST todos os 4 DAOs seriam instanciados, mas apenas 1 seria 
		 * utilizado (Recursos desperdiçados). 
		 */
        PessoaDAO.getInstance().insert(entity);
        
	}
	
	//Obs.:  É realmente necessário manter as duas classes PessoaBody e Pessoa 
	//já que elas são praticamente idênticas? Obrigatório não é, mas é interessante 
	//separar sim. Em aplicações reais e mais complexas é comum que a entidade possua 
	//muitos outros atributos que não interessam àquele serviço, mas a outro sim. 
	//Do mesmo modo, os payloads podem possuir atributos, listas ou referenciar outras 
	//classes que só fazem sentido no contexto dos serviços. Esta é apenas uma sugestão. 
	public static class PessoaBody {
		
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
