package lab.cadastro;

import static javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
import static javax.servlet.http.HttpServletResponse.SC_NOT_FOUND;
import static javax.servlet.http.HttpServletResponse.SC_NO_CONTENT;
import static javax.servlet.http.HttpServletResponse.SC_OK;
import static javax.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.EntityBuilder;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.gov.frameworkdemoiselle.HttpViolationException;
import br.gov.frameworkdemoiselle.UnprocessableEntityException;
import lab.cadastro.entity.Pessoa;
import lab.cadastro.entity.domain.PessoaBody;

public class PessoaRESTTest {

	private CloseableHttpClient client;

	private ObjectMapper mapper;

	private String url;
	private String urlPessoa;

	//private static final String BASIC_CREDENTIALS = "Basic " + Base64.encodeBase64String("test:secret".getBytes());
	
	private Logger LOG = LoggerFactory.getLogger(PessoaRESTTest.class);

	@Before
	public void before() throws Exception {
		client = HttpClientBuilder.create().build();
		mapper = new ObjectMapper();

		Configuration config = new PropertiesConfiguration("test.properties");
		url = config.getString("services.url");
		urlPessoa = url + "/pessoa";
		
	}

	@After
	public void after() throws Exception {
		client.close();
	}

	@Test
	public void buscarPessoas() throws Exception {
		
		//
		//Busca todas as Pessoas
		//
		HttpGet request = new HttpGet(urlPessoa);
		
		CloseableHttpResponse response = client.execute(request);
		response.close();
		
		assertEquals(SC_OK, response.getStatusLine().getStatusCode());

		List<Pessoa> pessoas = mapper.readValue(response.getEntity().getContent(),
				new TypeReference<List<Pessoa>>() {
				});
		
		LOG.info("* Busca todas as Pessoas...");
		for(int i=0; i < pessoas.size(); i++){
			LOG.info(pessoas.get(i).toString() + "\n");
		}
		
		//
		//Buscar Pessoa por Filtro
		//
		String filtro = "n";
		request = new HttpGet(urlPessoa + "?filtro=" + filtro);
		
		response = client.execute(request);
		response.close();
		
		assertEquals(SC_OK, response.getStatusLine().getStatusCode());

		List<Pessoa> pessoasFiltro = mapper.readValue(response.getEntity().getContent(),
				new TypeReference<List<Pessoa>>() {
				});

		LOG.info("* Busca todas as Pessoas pelo filtro (" + filtro + ") ...");
		for(int i=0; i < pessoasFiltro.size(); i++){
			assertTrue(pessoas.contains(pessoasFiltro.get(i)));
			LOG.info(pessoasFiltro.get(i).toString() + "\n");
		}
		
		//
		//Buscar Pessoa por ID
		//
		Integer id = Integer.valueOf(10);
		request = new HttpGet(urlPessoa + "/" + id);
		response = client.execute(request);
		response.close();
		
		assertEquals(SC_OK, response.getStatusLine().getStatusCode());

		PessoaBody pessoa = parseEntity(response.getEntity(), PessoaBody.class);
		assertEquals("nubio", pessoa.getNome());
		
	}

	@Test
	public void inserirPessoa() throws Exception {
		CloseableHttpResponse response = createSample();
		response.close();

		Integer id = parseEntity(response.getEntity(), Integer.class);
		assertNotNull(id);

		String expectedLocation = urlPessoa + "/" + id;
		String returnedLocation = response.getHeaders("Location")[0].getValue();
		assertEquals(expectedLocation, returnedLocation);

		HttpGet request = new HttpGet(returnedLocation);
		response = client.execute(request);
		response.close();

		destroySample(id);
	}

	@Test
	public void deleteSuccessful() throws Exception {
		Integer id = parseEntity(createSample().getEntity(), Integer.class);

		HttpDelete request = new HttpDelete(urlPessoa + "/" + id);
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		CloseableHttpResponse response = client.execute(request);
		response.close();
		
		assertEquals(SC_NO_CONTENT, response.getStatusLine().getStatusCode());
	}

	@Test
	public void updateSuccessful() throws Exception {

		Integer id = Integer.valueOf(11);
		String url = urlPessoa + "/" + id;
		HttpGet requestGet = new HttpGet(url);
		
		CloseableHttpResponse response = client.execute(requestGet);
		response.close();
		
		assertEquals(SC_OK, response.getStatusLine().getStatusCode());

		PessoaBody pessoa = parseEntity(response.getEntity(), PessoaBody.class);
		pessoa.setNome("JohnRambo");
		pessoa.setEmail("JohnRambo@gmail.com");

		HttpRequestBase requestPut = new HttpPut(url);
		((HttpPut) requestPut).setEntity(createEntity(pessoa));
		requestPut.addHeader("Content-Type", "application/json");
		//requestPut.addHeader("Authorization", BASIC_CREDENTIALS);
		response = client.execute(requestPut);
		response.close();
		
		assertEquals(SC_NO_CONTENT, response.getStatusLine().getStatusCode());

		requestGet = new HttpGet(url);
		response = client.execute(requestGet);
		response.close();
		
		PessoaBody p = parseEntity(response.getEntity(), PessoaBody.class);
		assertEquals(pessoa.getNome(), p.getNome());
		assertEquals(pessoa.getEmail(), p.getEmail());

	}

	@Test
	public void buscarFailed() throws ClientProtocolException, IOException {
		HttpGet request = new HttpGet(urlPessoa + "/99999999");
		CloseableHttpResponse response = client.execute(request);
		response.close();
		assertEquals(SC_NOT_FOUND, response.getStatusLine().getStatusCode());
	}

	//@Test
	public void insertFailed() throws Exception {
		HttpPost request;
		CloseableHttpResponse response;
		Pessoa pessoa;
		Set<UnprocessableEntityException.Violation> violations;
		HttpViolationException expected;

		pessoa = new Pessoa();
		pessoa.setNome("Google");
		pessoa.setEmail("google@gmail.com");
		request = new HttpPost(urlPessoa);
		request.setEntity(createEntity(pessoa));
		request.addHeader("Content-Type", "application/json");
		response = client.execute(request);
		response.close();
		assertEquals(SC_UNAUTHORIZED, response.getStatusLine().getStatusCode());

		pessoa = new Pessoa();
		request = new HttpPost(urlPessoa);
		request.setEntity(createEntity(pessoa));
		request.addHeader("Content-Type", "application/json");
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		response = client.execute(request);
		response.close();
		assertEquals(422, response.getStatusLine().getStatusCode());
		violations = mapper.readValue(response.getEntity().getContent(),
				new TypeReference<Set<UnprocessableEntityException.Violation>>() {
				});
		expected = new UnprocessableEntityException();
		expected.addViolation("description", "não pode ser nulo");
		expected.addViolation("link", "não pode ser nulo");
		assertEquals(expected.getViolations(), violations);

		pessoa = new Pessoa();
		pessoa.setNome("Google");
		pessoa.setEmail("google@gmail.com");
		request = new HttpPost(urlPessoa);
		request.setEntity(createEntity(pessoa));
		request.addHeader("Content-Type", "application/json");
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		response = client.execute(request);
		response.close();
		assertEquals(422, response.getStatusLine().getStatusCode());
		violations = mapper.readValue(response.getEntity().getContent(),
				new TypeReference<Set<UnprocessableEntityException.Violation>>() {
				});
		expected = new UnprocessableEntityException().addViolation("link", "formato inválido");
		assertEquals(expected.getViolations(), violations);

		pessoa = new Pessoa();
		pessoa.setId(Integer.valueOf(123456789));
		pessoa.setNome("Test");
		pessoa.setEmail("test@gmail.com");
		request = new HttpPost(urlPessoa);
		request.setEntity(createEntity(pessoa));
		request.addHeader("Content-Type", "application/json");
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		response = client.execute(request);
		response.close();
		assertEquals(SC_BAD_REQUEST, response.getStatusLine().getStatusCode());
	}

	@Test(expected=AssertionError.class)
	public void deleteFailed() throws Exception {
		HttpDelete request = new HttpDelete(urlPessoa + "/99999999");
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		CloseableHttpResponse response = client.execute(request);
		response.close();
		
		assertEquals(SC_NOT_FOUND, response.getStatusLine().getStatusCode());
	}

	//@Test
	public void updateFailed() throws Exception {
		HttpPut request;
		CloseableHttpResponse response = createSample();
		response.close();
		Long id = parseEntity(response.getEntity(), Long.class);
		Pessoa pessoa;
		Set<UnprocessableEntityException.Violation> violations;
		HttpViolationException expected;

		pessoa = new Pessoa();
		pessoa.setNome("Google");
		pessoa.setEmail("google@gmail.com");
		request = new HttpPut(urlPessoa + id);
		request.setEntity(createEntity(pessoa));
		request.addHeader("Content-Type", "application/json");
		response = client.execute(request);
		response.close();
		assertEquals(SC_UNAUTHORIZED, response.getStatusLine().getStatusCode());

		pessoa = new Pessoa();
		request = new HttpPut(urlPessoa + id);
		request.setEntity(createEntity(pessoa));
		request.addHeader("Content-Type", "application/json");
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		response = client.execute(request);
		response.close();
		assertEquals(422, response.getStatusLine().getStatusCode());
		violations = mapper.readValue(response.getEntity().getContent(),
				new TypeReference<Set<UnprocessableEntityException.Violation>>() {
				});
		expected = new UnprocessableEntityException();
		expected.addViolation("description", "não pode ser nulo");
		expected.addViolation("link", "não pode ser nulo");
		assertEquals(expected.getViolations(), violations);

//		pessoa = new Bookmark();
//		pessoa.setDescription("Google");
//		pessoa.setLink("http: // google . com");
//		request = new HttpPut(url + "/bookmark/" + id);
//		request.setEntity(createEntity(pessoa));
//		request.addHeader("Content-Type", "application/json");
//		request.addHeader("Authorization", BASIC_CREDENTIALS);
//		response = client.execute(request);
//		response.close();
//		assertEquals(422, response.getStatusLine().getStatusCode());
//		violations = mapper.readValue(response.getEntity().getContent(),
//				new TypeReference<Set<UnprocessableEntityException.Violation>>() {
//				});
//		expected = new UnprocessableEntityException().addViolation("link", "formato inválido");
//		assertEquals(expected.getViolations(), violations);
//
//		pessoa = new Bookmark();
//		pessoa.setId(Long.valueOf(123456789));
//		pessoa.setDescription("Test");
//		pessoa.setLink("http://test.com");
//		request = new HttpPut(url + "/bookmark/" + id);
//		request.setEntity(createEntity(pessoa));
//		request.addHeader("Content-Type", "application/json");
//		request.addHeader("Authorization", BASIC_CREDENTIALS);
//		response = client.execute(request);
//		response.close();
//		assertEquals(SC_BAD_REQUEST, response.getStatusLine().getStatusCode());
//
//		destroySample(id);
	}

	private CloseableHttpResponse createSample() throws Exception {

		PessoaBody pessoa = new PessoaBody();
		pessoa.setNome("google");
		pessoa.setEmail("google@gmail.com");
		pessoa.setTelefone("(99) 9999-9999");

		HttpPost request = new HttpPost(urlPessoa);
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		request.addHeader("Content-Type", "application/json");
		request.setEntity(EntityBuilder.create().setText(mapper.writeValueAsString(pessoa)).build());
		
		CloseableHttpResponse response = client.execute(request);
		response.close();

		return response;
	}

	private void destroySample(Integer id) throws Exception {
		HttpDelete request = new HttpDelete(urlPessoa + "/" + id);
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		client.execute(request).close();
	}

	private <T> T parseEntity(HttpEntity entity, Class<T> type) throws Exception {
		return mapper.readValue(entity.getContent(), type);
	}

	private HttpEntity createEntity(Object object) throws Exception {
		return EntityBuilder.create().setText(mapper.writeValueAsString(object)).build();
	}
	
}
