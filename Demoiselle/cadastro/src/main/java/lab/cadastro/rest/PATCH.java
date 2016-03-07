package lab.cadastro.rest;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.ws.rs.HttpMethod;

/**
 * 
 * Anotação @PACTH foi criada uma vez que a especificação JAX-RS 
 * segue à risca a proposta original do HTTP (na qual não encontramos 
 * a anotação @PATCH.)
 * 
 * @author 02963357460
 *
 */
@HttpMethod("PATCH")
@Target({ ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface PATCH {
}