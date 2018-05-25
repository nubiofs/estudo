package com.example.demo.interceptor;

import java.io.Serializable;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



//@RequestScoped
//@Typed(AutenticacaoInterceptor.class)
//@Dependent

@Interceptor
@IJWTAutenticator(methodName = "")
public class AutenticacaoInterceptor implements Serializable {

	
	//@Inject
	//HttpServletResponse response;
	
	//HttpServletResponse response = Beans.getReference(HttpServletResponse.class);
	//HttpServletResponse response = Beans.getFacade(HttpServletResponse.class);
	
	//HttpServletResponse response;
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@AroundInvoke
	public Object verificarJWT(InvocationContext context) throws Exception {
		IJWTAutenticator jwtAut = context.getMethod().getAnnotation(IJWTAutenticator.class);
		System.out.println("Chamado AutenticacaoInterceptor (para o método: " + jwtAut.methodName() +" )");
		
		for(Object param : context.getParameters()) {
			System.out.println("Param: " + param);
		}

//		String usuario = (String) context.getContextData().get("usuario");
//        if (usuario == null) {
//                 usuario = (String) context.getParameters()[0];
//                 context.getContextData().put("usuario", usuario);
//        }
		
		Object retorno = null;
		
		Object[] param = context.getParameters();
		if(param.length == 3) {
			String jwt = (String) param[0];
			if(!jwt.contains("eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ")) {
				//response.setStatus(Status.UNAUTHORIZED.ordinal());
				//response.addHeader("body", "NOT OK");
				
//				javax.ws.rs.core.Response.ResponseBuilder r = Response.status(Status.UNAUTHORIZED).entity("");
//				r.build();
				
				HttpServletResponse response = (HttpServletResponse) param[1];
				//System.out.println("Token Jwt não autenticado! " + );
				response.addHeader("Resposta", "Token Jwt não autenticado! ");
				HttpServletRequest request = (HttpServletRequest) param[2]; 
				System.out.println("IP : " + request.getLocalAddr());
				//response.setHeader("Cache-Control", ic.getMethod().getAnnotation(Cache.class).value());
				//throw new IllegalAccessException("Token Jwt não autenticado!");
			} else {
				retorno = context.proceed();
			}
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

    @PostConstruct
    public void ativa(InvocationContext context){
    	System.out.println("Ativando…");
    	//LoginEndpoint obj = (LoginEndpoint) context.getTarget();
    	//String ip = obj.getHttpServletRequest().getLocalAddr();
    	//System.out.println("LocalAddr: "+ip);
        //obj.getHttpServletResponse().addHeader("Retorno", "OK ativa! Para: " +ip);
    	//obj.getHttpServletResponse().addHeader("Retorno", "OK ativa!");
    }

    @PreDestroy
    public void desativa(){
              System.out.println("Desativando…");
    }
	

}
