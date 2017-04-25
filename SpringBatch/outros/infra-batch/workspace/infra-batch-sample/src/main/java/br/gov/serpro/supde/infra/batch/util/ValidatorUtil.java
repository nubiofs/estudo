package br.gov.serpro.supde.infra.batch.util;

import javax.validation.Validation;
import javax.validation.Validator;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;

public class ValidatorUtil {
	
	//private static final Logger LOGGER = LoggerFactory.getLogger(ValidatorUtil.class);
    private static final Validator javaxValidator = Validation.buildDefaultValidatorFactory().getValidator();
    private static final SpringValidatorAdapter validator = new SpringValidatorAdapter(javaxValidator);

    public static Object validate(Object entry) throws InvalidDataException {
    	
        Errors errors = new BeanPropertyBindingResult(entry, entry.getClass().getName());
        validator.validate(entry, errors);
        
        if (errors == null || errors.getAllErrors().isEmpty()){
            return entry;
        }
        else {
            //LOGGER.error(errors.toString());
            throw new InvalidDataException(errors.getAllErrors().toString(), errors);
        }
        
    }

}
