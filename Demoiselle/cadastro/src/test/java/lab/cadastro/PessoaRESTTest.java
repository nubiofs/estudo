package lab.cadastro;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import static javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
import static javax.servlet.http.HttpServletResponse.SC_NOT_FOUND;
import static javax.servlet.http.HttpServletResponse.SC_NO_CONTENT;
import static javax.servlet.http.HttpServletResponse.SC_OK;
import static javax.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;

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

import br.gov.frameworkdemoiselle.HttpViolationException;
import br.gov.frameworkdemoiselle.UnprocessableEntityException;
import lab.cadastro.entity.Pessoa;

public class PessoaRESTTest {

	private CloseableHttpClient client;

	private ObjectMapper mapper;

	private String url;
	private String urlPessoa;

	//private static final String BASIC_CREDENTIALS = "Basic " + Base64.encodeBase64String("test:secret".getBytes());

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
	public void buscarPessoas() throws ClientProtocolException, IOException {
		
		HttpGet request = new HttpGet(urlPessoa);
		
		CloseableHttpResponse response = client.execute(request);
		response.close();
		
		assertEquals(SC_OK, response.getStatusLine().getStatusCode());

		List<Pessoa> pessoas = mapper.readValue(response.getEntity().getContent(),
				new TypeReference<List<Pessoa>>() {
				});
		
		for(int i=0; i < pessoas.size(); i++){
			System.out.println(pessoas.get(i).toString() + "\n");
		}
//		
//		String filter = "po";
//		request = new HttpGet(url + "/bookmark?q=" + filter);
//		response = client.execute(request);
//		response.close();
//		List<Pessoa> filteredList = mapper.readValue(response.getEntity().getContent(),
//				new TypeReference<List<Pessoa>>() {
//				});
//		assertEquals(SC_OK, response.getStatusLine().getStatusCode());

//		for (Pessoa bookmark : filteredList) {
//			assertTrue(bookmark.getDescription().toLowerCase().contains(filter)
//					|| bookmark.getLink().toLowerCase().contains(filter));
//			assertTrue(listAll.contains(bookmark));
//		}
		
	}

	//@Test
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
	
	//@Test
	public void loadSuccessful() throws Exception {
		Integer id = parseEntity(createSample().getEntity(), Integer.class);

		HttpGet request = new HttpGet(urlPessoa + id);
		CloseableHttpResponse response = client.execute(request);
		response.close();
		assertEquals(SC_OK, response.getStatusLine().getStatusCode());

		Pessoa bookmark = parseEntity(response.getEntity(), Pessoa.class);
		assertEquals(Long.valueOf(id), bookmark.getId());
//		assertEquals("Google", bookmark.getDescription());
//		assertEquals("http://google.com", bookmark.getLink());

		destroySample(id);
	}

	//@Test
	public void loadFailed() throws ClientProtocolException, IOException {
		HttpGet request = new HttpGet(urlPessoa + "/99999999");
		CloseableHttpResponse response = client.execute(request);
		response.close();
		assertEquals(SC_NOT_FOUND, response.getStatusLine().getStatusCode());
	}

	//@Test
	public void deleteSuccessful() throws Exception {
		Long id = parseEntity(createSample().getEntity(), Long.class);

		HttpDelete request = new HttpDelete(urlPessoa + id);
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		CloseableHttpResponse response = client.execute(request);
		response.close();
		assertEquals(SC_NO_CONTENT, response.getStatusLine().getStatusCode());
	}

	//@Test
	public void deleteFailed() throws Exception {
		HttpDelete request;
		CloseableHttpResponse response;

		Integer id = parseEntity(createSample().getEntity(), Integer.class);
		request = new HttpDelete(urlPessoa + id);
		response = client.execute(request);
		response.close();
		assertEquals(SC_UNAUTHORIZED, response.getStatusLine().getStatusCode());
		destroySample(id);

		request = new HttpDelete(url + "/pessoa/99999999");
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		response = client.execute(request);
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

	//@Test
	public void updateSuccessful() throws Exception {
		HttpRequestBase request;
		CloseableHttpResponse response = createSample();
		response.close();

		Pessoa pessoa = new Pessoa();
		pessoa.setNome("Google Maps");
		pessoa.setEmail("mapsgoogle@gmail.com");

		Integer id = parseEntity(response.getEntity(), Integer.class);
		String resourceUrl = urlPessoa + id;

		request = new HttpPut(resourceUrl);
		((HttpPut) request).setEntity(createEntity(pessoa));
		request.addHeader("Content-Type", "application/json");
		//request.addHeader("Authorization", BASIC_CREDENTIALS);
		response = client.execute(request);
		response.close();
		assertEquals(SC_NO_CONTENT, response.getStatusLine().getStatusCode());

		request = new HttpGet(resourceUrl);
		response = client.execute(request);
		response.close();
		Pessoa result = parseEntity(response.getEntity(), Pessoa.class);
		assertEquals(id, result.getId());
//		assertEquals(pessoa.getDescription(), result.getDescription());
//		assertEquals(pessoa.getLink(), result.getLink());

		destroySample(id);
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
		Pessoa pessoa = new Pessoa();
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
		HttpDelete request = new HttpDelete(urlPessoa + id);
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
