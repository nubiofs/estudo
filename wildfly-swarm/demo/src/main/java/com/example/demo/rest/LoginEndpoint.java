package com.example.demo.rest;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.demo.interceptor.IJWTAutenticator;

@ApplicationScoped
@Path("/login")
public class LoginEndpoint {
	
	@Inject
	HttpServletResponse response;
	
	@Inject
	HttpServletRequest request;
	
	private Logger LOG = LoggerFactory.getLogger(LoginEndpoint.class);

	//curl -X GET localhost:8080/api/login
	@GET
	@Produces("text/plain")
	@IJWTAutenticator(methodName = "login")
	public Response login() {
		return Response.ok("Usuário está locado!\n").build();
	}

	public HttpServletResponse getHttpServletResponse() {
		return response;
	}
	
	public HttpServletRequest getHttpServletRequest() {
		return request;
	}
	
	//curl -X GET localhost:8080/api/login/jwt/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
	@Path("/jwt/{jwt}")
	@GET
	@Produces("text/plain")
	@IJWTAutenticator(methodName = "consultaBanco")
	//@QueryParam
	public Response consultaBanco(@PathParam("jwt") String jwt) {
		
		try {
			
//			 Response.ok().entity(credencial.toMap())
//				.header("Access-Control-Expose-Headers", "Set-Token")
//				.header("Set-Token", valueProcessado).build();
			
			return Response.ok("Solicitação de consulta ao banco foi autorizada e realizada...! Via autenticação do jwt: " + jwt + "\n").build();
		} catch (Exception e) {
			return Response.serverError().entity(e.getMessage()).build();
		}
		
	}
	
	private ResponseBuilder unauthorized(String msg) {
		LOG.warn(msg);
		return Response.status(Status.UNAUTHORIZED).entity(msg);
	}

	
}