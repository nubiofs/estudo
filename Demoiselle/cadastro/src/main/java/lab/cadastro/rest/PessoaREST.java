package lab.cadastro.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.gov.frameworkdemoiselle.BadRequestException;
import br.gov.frameworkdemoiselle.NotFoundException;
import br.gov.frameworkdemoiselle.transaction.Transactional;
import br.gov.frameworkdemoiselle.util.ValidatePayload;
import lab.cadastro.entity.Pessoa;
import lab.cadastro.entity.domain.PessoaBody;
import lab.cadastro.entity.domain.PessoaListBody;
import lab.cadastro.entity.domain.PessoaPatchBody;
import lab.cadastro.persistence.PessoaDAO;

@Path("pessoa")
public class PessoaREST {

	private Logger LOGGER = LoggerFactory.getLogger(PessoaREST.class);

	/**
	 * - Exemplos de utilização com Postman:
	 * 
	 * *(I)*
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
	 * Com o header de resposta (status 201):
	 * 
	 * Content-Length → 2
	 * Content-Type → text/plain
	 * Date → Tue, 01 Mar 2016 14:05:13 GMT
	 * Location → http://localhost:8080/cadastro/api/pessoa/10
	 * Server → Apache-Coyote/1.1
	 *
	 * Com body (o id do recurso criado):
	 * 
	 * 10
	 *
	 * *(II)*
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
	 * Com (mensagens de validação) - (status 422):
	 * 
	 *  Request payload
	 * [
	 *	    {
	 *	        "property" : "email",
	 *	        "message" : "não é um endereço de e-mail"
	 *	    }
	 * ]
	 *
	 * *(III)*
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoa
	 * Method: POST
	 * Content-Type: application/json
	 * Payload Raw: o seguinte conteúdo:
	 * {
	 *     "nome" : "John Malkovich",
	 *     "email" : "",
	 *     "telefone" : "(71) 1234-5678"
	 * }
	 *
	 * Com (mensagens de validação) - (status 422):
	 * 
	 *  Request payload
	 * [
	 *	    {
	 *	        "property" : "email",
	 *	        "message" : "não pode estar vazio"
	 *	    }
	 * ]
	 * 
	 * - Exemplo de utilização com cURL:
	 * 
	 * curl -X POST -H "Content-type:application/json" \ 
	 * -d "{\"nome\" : \"teste3\", \"email\" : \"teste3@gmail.com\", \"telefone\" : \"(11) 2222-3333\"}" \
	 * http://localhost:8080/cadastro/api/pessoa
	 * 
	 */
	@POST
	@ValidatePayload
	@Consumes("application/json")
	@Produces("text/plain")
	@Transactional
	public Response inserir(PessoaBody p) {
		LOGGER.info("Pessoa (nome=" + p.getNome() + ", email=" + p.getEmail() + ")");

		Pessoa entity = new Pessoa();
		entity.setNome(p.getNome());
		entity.setEmail(p.getEmail());
		entity.setTelefone(p.getTelefone());

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

		Integer id = entity.getId();

		String url = "http://localhost:8080/cadastro/api/pessoa/" + id;
		// A requisição POST foi utilizada para criar um recurso,
		// logo deve ser gerado o status 201 "Created".
		// return Response.status(201).
        return Response.status(Status.CREATED).
        		header("Location", url).//A URL deve estar presente o atributo Location do header (da resposta)
        		entity(id).build();//O body deve conter a identificação do novo recurso.

	}

	/**
	 *
	 * - Exemplo de utilização com Postman:
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoa/10
	 * Method: GET
	 * 
	 * - O recurso retornado seria 
	 * (status 20, caso tenha sido ateriormente criado o recurso com id = 10):
	 * 
	 * Response payload "o body"
	 * {
	 *    "nome" : "John Malkovich",
	 * 	  "email" : "john.malkovich@gmail.com",
	 *    "telefone" : "(71) 1234-5678"
	 * }
	 * 
	 * - Exemplo de utilização com cURL:
	 * 
	 * curl -X GET http://localhost:8080/cadastro/api/pessoa
	 * 
	 */
	@GET
	@Path("{id}")
	@Produces("application/json")
	@Transactional
	public PessoaBody obter(@PathParam("id") Integer id) throws Exception {
		Pessoa pessoa = PessoaDAO.getInstance().load(id);

		if (pessoa == null) {
			// Caso o recurso não exista responde com o status 404.
			// Lançando a exceção NotFoundException o próprio Demoiselle
			// se encarregará de montar o response com o status apropriado.
			throw new NotFoundException();
		}

		return new PessoaBody(pessoa);

	}

	// PUT para fazer a atualização completa da Pessoa
	/**
	 * - Exemplo de utilização com Postman:
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoa/10
	 * Method: PUT
     * Content-Type: application/json
     * Payload Raw: o seguinte conteúdo:
	 *
	 * Request payload
	 * {
	 *    "nome" : "John",
	 *    "email" : "john@gmail.com",
	 *    "telefone" : "(71) 0000-0000"
	 * }
	 * 
	 * Response payload
 	 * {
	 *    "nome" : "John",
	 *    "email" : "john@gmail.com",
	 *    "telefone" : "(71) 0000-0000"
	 * }
	 * 
	 * 
	 * IMPORTANTE, e Se (sem informar o telefone):
	 * 
	 * * Request payload
	 * {
	 *    "nome" : "JohnRambo",
	 *    "email" : "JohnRambo@gmail.com"
	 * }
	 * 
	 * No banco teriamos:
	 * 
	 * SELECT * FROM PESSOA;
	 * 
	 * ID 	| EMAIL  			| NOME  	| TELEFONE  
	 * 10	JohnRambo@gmail.com	JohnRambo	null
	 * 
	 * A requisição foi concluída com status de sucesso. 
	 * Porém, como o PUT substitui por completo o conteúdo do recurso e 
	 * o telefone não foi informado (sendo opcional), faz sentido interpretar 
	 * que o conteúdo para telefone será "nulo".
	 * 
	 */
	@PUT
	@Path("{id}")
	@ValidatePayload
	@Consumes("application/json")
	@Transactional
	public void atualizar(@PathParam("id") Integer id, PessoaBody body) throws Exception {

		PessoaDAO pessoaDAO = PessoaDAO.getInstance();
		Pessoa pessoa = pessoaDAO.load(id);

		if (pessoa == null) {
			// Caso registro no banco de dados associado ao id não exista.
			//O Demoiselle tratará a exceção e montará um response com status 404
			throw new NotFoundException();
		}

		pessoa.setNome(body.getNome());
		pessoa.setEmail(body.getEmail());
		pessoa.setTelefone(body.getTelefone());

		pessoaDAO.update(pessoa);

	}

	// O método PATCH é atualizado para atualizar só uma parte do recurso, e não
	// substiuí-lo por completo como o PUT faz. Ou seja, pode haver a
	// necessidade de atualizar apenas o nome da pessoa sem ter que enviar junto
	// o email (obrigatório) e o telefone (opcional), por exemplo. Para isso foi
	// criado o método PATCH.
	/**
	 * - Exemplo de utilização com Postman:
	 * 
     * URL: http://localhost:8080/cadastro/api/pessoa/10
	 * Method: PATCH
	 * Payload Raw: o seguinte conteúdo:
	 *
	 * Request payload
	 * {
	 *   "telefone" : "(71) 0000-6666"
	 * }
	 * 
	 * Em seguida:
	 * 
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoas/10
	 * Method: GET
	 *
	 * Note que o comportamento foi diferente do PUT. Agora sim a 
	 * operação foi parcial, atualizando apenas o telefone:
	 *
	 * Response payload
	 * {
	 *    "nome" : "John Malkovich",
	 *    "email" : "john.malkovich@gmail.com",
	 *    "telefone" : "(71) 0000-6666"
	 *}
	 * 
	 */
	@PATCH
	@Path("{id}")
	@ValidatePayload
	@Consumes("application/json")
	@Transactional
	public void atualizarParcial(@PathParam("id") Integer id, PessoaPatchBody body) throws Exception {
		PessoaDAO pessoaDAO = PessoaDAO.getInstance();
		Pessoa pessoa = pessoaDAO.load(id);

		if (pessoa == null) {
			throw new NotFoundException();
		}

		//
		//Apenas atuliza os campos preenchidos/atualizados em body "PessoaPatchBody"
		//
		
		if (body.getNome() != null) {
			pessoa.setNome(body.getNome());
		}

		if (body.getEmail() != null) {
			pessoa.setEmail(body.getEmail());
		}

		if (body.getTelefone() != null) {
			pessoa.setTelefone(body.getTelefone());
		}

		pessoaDAO.update(pessoa);

	}

	// Se a lista estiver vazia, há o retorno do
	// status 204 (OK, sem conteúdo) com o body vazio.
	/**
	 * - Exemplo de utilização com Postman:
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoa
	 * Method: GET
	 *
	 * Response payload "o body" de resposta
	 * 
	 * [
	 *  {
	 *    "id" : 11,
	 *    "nome" : "John Malkovich",
	 *    "email" : "john.malkovich@gmail.com",
	 *    "telefone" : "(71) 0000-6666"
	 *  },
	 *  {
	 *    "id" : 10,
	 *    "nome" : "nubio",
	 *    "email" : "nubio@gmail.com",
	 *    "telefone" : "(81) 2126-2270"
	 *  }
	 * ]
	 * 
	 */
	//
	//IMPORTANTE: Código comentado, pois esse método "buscar" sem informar nenhum 
	//parâmetro de filtro, apresenta o mesmo resultado de execução do método "buscar"
	// (que espera ou não a passagem do parâmetro filtro, via "query string").
	//
	/*
	@GET
    @Produces("application/json")
    public List<PessoaListBody> buscar() {
        List<PessoaListBody> result = new ArrayList<PessoaListBody>();
 
        for (Pessoa pessoa : PessoaDAO.getInstance().find()) {
            PessoaListBody body = new PessoaListBody();
            body.id = pessoa.getId();
            body.nome = pessoa.getNome();
            body.email = pessoa.getEmail();
            body.telefone = pessoa.getTelefone();
 
            result.add(body);
        }
 
        return result.isEmpty() ? null : result;
    }
	 */

	// Como o método GET não possui request body, então os parâmetros
	// são passados na URL no padrão "query string".
	/**
	 * - Exemplo de utilização com Postman:
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoa?filtro=n
	 * Method: GET
	 *
	 * Response payload "o body" de resposta
	 * 
	 * [
	 *  {
	 *    "id" : 11,
	 *    "nome" : "batman",
	 *    "email" : "batman@gmail.com",
	 *    "telefone" : "(81) 1234-5678"
	 *  },
	 *  {
	 *    "id" : 10,
	 *    "nome" : "nubio",
	 *    "email" : "nubio@gmail.com",
	 *    "telefone" : "(81) 2126-2270"
	 *  }
	 * ]
	 * 
	 */
	/*
	@GET
	@Produces("application/json")
	public List<PessoaListBody> buscar(@QueryParam("filtro") String filtro) {
	    List<PessoaListBody> result = new ArrayList<PessoaListBody>();
	 
	    for (Pessoa pessoa : PessoaDAO.getInstance().find(filtro)) {
	        PessoaListBody body = new PessoaListBody();
	        body.id = pessoa.getId();
	        body.nome = pessoa.getNome();
	        body.email = pessoa.getEmail();
	        body.telefone = pessoa.getTelefone();
	 
	        result.add(body);
	    }
	 
	    return result.isEmpty() ? null : result;
	}
	 */

	// Como o método GET não possui request body, então os parâmetros
	// são passados na URL no padrão "query string".
	/**
	 * - Exemplo de utilização com Postman:
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoa?ordem=nome
	 * Method: GET
	 *
	 * Response payload "o body" de resposta
	 * 
	 * [
	 * 
	 *	{
	 *    "id" : 11,
	 *    "nome" : "batman",
	 *    "email" : "batman@gmail.com",
	 *    "telefone" : "(81) 1234-5678"
	 *  },
	 *  {
	 *    "id": 12,
	 *    "nome": "ela",
	 *    "email": "ela@gmail.com",
	 *    "telefone": "(81) 5678-3333"
	 *  },
	 *  {
	 *    "id" : 10,
	 *    "nome" : "nubio",
	 *    "email" : "nubio@gmail.com",
	 *    "telefone" : "(81) 2126-2270"
	 *  }
	 * 
	 * ]
	 * 
	 */
	@GET
	@Produces("application/json")
	public List<PessoaListBody> buscar(@QueryParam("filtro") String filtro, @QueryParam("ordem") String ordem)
			throws Exception {
		List<PessoaListBody> result = new ArrayList<PessoaListBody>();
		List<Pessoa> pessoas;

		try {
			pessoas = PessoaDAO.getInstance().find(filtro, ordem);
		} catch (IllegalArgumentException cause) {
			// O Demoiselle automaticamente definirá o response status
			// com o código 400 (Bad Request), que representa erro de
			// sintaxe na requisição feita pelo front-end.
			throw new BadRequestException();
		}

		for (Pessoa pessoa : pessoas) {
			result.add(new PessoaListBody(pessoa));
		}

		return result.isEmpty() ? null : result;
	}

	/**
	 * - Exemplo de utilização com Postman:
	 * 
	 * URL: http://localhost:8080/cadastro/api/pessoa/14
	 * Method: DELETE
	 *
	 */
	@DELETE
	@Path("{id}")
	@Transactional
	public void delete(@PathParam("id") Integer id) throws Exception {
		PessoaDAO.getInstance().remover(id);
	}

}
