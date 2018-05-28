package com.example.demo.interceptor;

import static java.util.regex.Pattern.CASE_INSENSITIVE;

import java.io.Serializable;
import java.util.Enumeration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.demo.interceptor.exception.AutenticacaoException;
import com.example.demo.interceptor.exception.HttpServletRequestResponseException;
import com.example.demo.interceptor.exception.TokenInvalidoException;

@Interceptor
@IJWTAutenticator(methodName = "")
public class AutenticacaoInterceptor implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Logger LOG = LoggerFactory.getLogger(AutenticacaoInterceptor.class);

	private HttpServletRequest request = null;
	private HttpServletResponse response = null;

	public static final String AUTHORIZATION_HEADER = "authorization";

	private static final String UNAUTHORIZED_ERROR = "Solicitação não autorizada!";
	private static final String JWT_ERROR = "Token JWT inválido!";

	@AroundInvoke
	//public Object autenticarJWT(InvocationContext context) throws Exception {
	public Object autenticarJWT(InvocationContext context) throws HttpServletRequestResponseException, TokenInvalidoException, AutenticacaoException {
		
		Object retorno = null;

		IJWTAutenticator jwtAut = context.getMethod().getAnnotation(IJWTAutenticator.class);
		LOG.info("Chamado AutenticacaoInterceptor (para o método: " + jwtAut.methodName() +" )");

		getRequestResponse(context.getParameters());
		verificarAutenticacao(this.request);
		try {
			retorno = context.proceed();
		} catch (Exception e) {
		}

		return retorno;

	}

	//	String class = ctx.getMethod().getDeclaringClass().getName();
	//	        String method = ctx.getMethod().getName();
	//	        Logger.global.entering(class, method, ctx.getParameters());
	//	        try {
	//	           Object result = ctx.proceed();
	//	           Logger.global.exiting(class, method, result);
	//	           return result;
	//	        }
	//	        catch (Exception e) {
	//	           Logger.global.throwing(class, method, e);
	//	           throw e;
	//	        }

	//	@AroundInvoke
	//	public Object manage(final InvocationContext ic) throws Exception {
	//		Object result = ic.proceed();
	//
	//		HttpServletResponse response = Beans.getReference(HttpServletResponse.class);
	//		response.setHeader("Cache-Control", ic.getMethod().getAnnotation(Cache.class).value());
	//
	//		return result;
	//	}

	private void getRequestResponse(Object[] parametros) throws HttpServletRequestResponseException {

		this.request = null;
		this.response = null;

		for(Object param : parametros) {

			if (param instanceof HttpServletRequest) {
				this.request = (HttpServletRequest) param;
			} else if(param instanceof HttpServletResponse) {
				this.response = (HttpServletResponse) param;
			} 

		}

		if(this.request == null || this.response == null) {
			throw new HttpServletRequestResponseException("HttpServletRequest e/ou HttpServletResponse não informados!");
		}

	}

	private void verificarAutenticacao(HttpServletRequest request) throws TokenInvalidoException, AutenticacaoException {

		String jwt = getAuthJWT(request);

		if(!jwt.contains("eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ")) {
			throw new AutenticacaoException(UNAUTHORIZED_ERROR);
		}

	}

	private String getAuthJWT(HttpServletRequest request) throws TokenInvalidoException {

		String authHeader = getAuthHeader(request);

		if (!StringUtils.isEmpty(authHeader)) {

			String regexp = "^" + "Token" + "[ \\n]+(.+)$";
			Pattern pattern = Pattern.compile(regexp, CASE_INSENSITIVE);
			Matcher matcher = pattern.matcher(authHeader);

			if (matcher.matches()) {
				return matcher.group(1);//authJWT
			}

		} 

		throw new TokenInvalidoException(JWT_ERROR);

	}

	private String getAuthHeader(HttpServletRequest request) {

		String valor = null;

		for (final Enumeration<String> names = request.getHeaderNames(); names.hasMoreElements();) {
			String nome = names.nextElement();

			if (AUTHORIZATION_HEADER.equalsIgnoreCase(nome)) {
				valor = request.getHeader(nome);
				break;
			}
		}

		return valor;

	}

	//	@PreDestroy
	//	public void desativa(){
	//		LOG.info("Desativando…");
	//		this.request = null;
	//		this.response = null;
	//	}

//	@PostActivate
//	public void desativa() {
//		LOG.info("Desativando…");
//	}
	
}
