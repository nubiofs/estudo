package br.gov.auth;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import br.gov.planejamento.siconv.authjwt.security.Secured;
import br.gov.planejamento.siconv.authjwt.security.SiconvPrincipal;

/**
 * $ ~/mvn clean package
 * $ java -jar -Xmx128m -Dswarm.bind.address=0.0.0.0 -Dpublickey.jwt="-----BEGIN CERTIFICATE-----kskfjdkks-----END CERTIFICATE-----" target/auth-swarm.jar
 * $ curl -k -i -X GET -H "Authorization: Bearer ksdjs.ked83i8k.kskjdk" localhost:8080/api/hello/jwt
 * 
 */
@ApplicationScoped
@Path("/hello")
public class HelloWorldEndpoint {
	
	@javax.inject.Inject
	private SiconvPrincipal context;
	
	@GET
	@Produces("text/plain")
	public Response doGet() {
		return Response.ok("Hello from WildFly Swarm!\n").build();
	}
	
	//curl -X GET localhost:8080/api/hello/jwt
	@Path("/jwt")
	@GET
	@Produces("text/plain")
	@Secured
	public Response jwt() {
		return Response.ok("Usuário " + context.getCpf() + " está locado!\n").build();
	}

}