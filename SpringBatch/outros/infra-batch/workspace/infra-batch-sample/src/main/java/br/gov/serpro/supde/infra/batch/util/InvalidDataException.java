package br.gov.serpro.supde.infra.batch.util;

import org.springframework.validation.Errors;

/**
 * This exception is thrown when the dao has invalid data.
 */
public class InvalidDataException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Errors errors;

    public InvalidDataException(String msg, Errors errors) {
        super(msg);
        setErrors(errors);
    }

    public Errors getErrors() {
        return errors;
    }

    public void setErrors(Errors errors) {
        this.errors = errors;
    }
    
}
