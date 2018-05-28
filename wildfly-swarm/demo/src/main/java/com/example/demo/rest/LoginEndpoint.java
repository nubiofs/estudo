package com.example.demo.rest;

import java.io.Serializable;

import javax.enterprise.context.ApplicationScoped;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.demo.interceptor.IJWTAutenticator;

/**
 * 
 * $ ~/mvn clean package
 * $ java -jar -Xmx128m -Dswarm.bind.address=0.0.0.0 target/demo-swarm.jar 
 *
 *	(In "open HttpRequester" plugin for Firefox:
 *
 *	-- Caminho feliz --
 *
 * URL:
 * 	http://localhost:8080/api/login/jwt
 * 	GET
 * 	Headers
 * 		Name: Authorization
 * 		Valeu: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 * 	
 * -> Response:
 * 200 OK
 * Solicitação de consulta ao banco foi autorizada e realizada...! Via jwt válido!
 * 
 * 	-- Erro no Token (falta do mesmo) --
 * 
 * URL:
 * 	http://localhost:8080/api/login/jwt
 * 	GET
 * 
 * -> Response:
 * 401 Unauthorized
 * com.example.demo.exception.TokenInvalidoException: Token JWT inválido!
 * 
 * 	-- Erro no Token (jwt inválido) --
 * 
 * URL:
 * 	http://localhost:8080/api/login/jwt
 * 	GET
 * 	Headers
 * 		Name: Authorization
 * 		Valeu: Token eyJhbeyJzdw5c
 * 
 * -> Response:
 * 401 Unauthorized
 * com.example.demo.exception.TokenInvalidoException: Token JWT inválido!
 * 
 * 	-- Não autenticado --
 * 
 * URL:
 * 	http://localhost:8080/api/login/jwt
 * 	GET
 * 	Headers
 * 		Name: Authorization
 * 		Valeu: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eydfdks.sdkfjdkk
 * 
 * -> Response:
 * 401 Unauthorized
 * com.example.demo.exception.AutenticacaoException: Solicitação não autorizada!
 * 
 */
@ApplicationScoped
@Path("/login")
public class LoginEndpoint implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	//	@Context HttpServletResponse response; 
	//	@Context HttpServletRequest request;

	private Logger LOG = LoggerFactory.getLogger(LoginEndpoint.class);

	//curl -X GET localhost:8080/api/login
	@GET
	@Produces("text/plain")
	@IJWTAutenticator(methodName = "login")
	public Response login() {
		return Response.ok("Usuário está locado!\n").build();
	}
	
	//curl -X GET -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" localhost:8080/api/login/jwt
	//curl -k -i -X GET -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" localhost:8080/api/login/jwt
	@Path("/jwt")
	@GET
	@Produces("text/plain")
	@IJWTAutenticator(methodName = "consultaBanco")
	//@QueryParam
	public Response consultaBanco(final @Context HttpServletResponse response, final @Context HttpServletRequest httpServletRequest) {

		try {

			//			 Response.ok().entity(credencial.toMap())
			//				.header("Access-Control-Expose-Headers", "Set-Token")
			//				.header("Set-Token", valueProcessado).build();

			//return Response.ok("Solicitação de consulta ao banco foi autorizada e realizada...! Via autenticação do jwt: " + jwt + "\n").build();
			String msg = "Solicitação de consulta ao banco foi autorizada e realizada...! Via jwt válido!\n";
			LOG.info(msg);
			return Response.ok(msg).build();
		} catch (Exception e) {
			return Response.serverError().entity(e.getMessage()).build();
		}

	}

}