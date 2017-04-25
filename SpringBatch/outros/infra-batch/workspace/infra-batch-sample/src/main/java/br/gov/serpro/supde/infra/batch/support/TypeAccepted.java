package br.gov.serpro.supde.infra.batch.support;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Constraint(validatedBy = TypeAcceptedValidator.class)
@Documented
@Target(ElementType.FIELD )
@Retention(RetentionPolicy.RUNTIME)  
public @interface TypeAccepted {
	
    String message() default "Not allowded value";  
  
    Class<?>[] groups() default {};  
  
    Class<? extends Payload>[] payload() default {};  
    
}
