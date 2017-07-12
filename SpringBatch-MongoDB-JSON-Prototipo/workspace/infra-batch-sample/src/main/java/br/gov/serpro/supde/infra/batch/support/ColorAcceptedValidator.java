package br.gov.serpro.supde.infra.batch.support;

import java.util.HashSet;
import java.util.Set;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.validation.BeanPropertyBindingResult;

import br.gov.serpro.supde.infra.batch.util.ColorEnum;
import br.gov.serpro.supde.infra.batch.util.InvalidDataException;

public class ColorAcceptedValidator  implements ConstraintValidator<ColorAccepted, String>{

	private Set<String> valueList;

	@Override
	public void initialize(ColorAccepted constraint) {
		valueList = new HashSet<String>();  
		for (String val : constraint.acceptValues()) {  
			valueList.add(val.toLowerCase());  
		}
		//valueList = new HashSet( Arrays.asList( constraint.acceptValues() ) );
	}

	/**
     * Validate a specified value.
     * returns false if the specified value does not conform to the definition
     */
	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		
		if ( value == null || "".equals(value)) {//Para valores opcionais
			return true;
		}

		if (!valueList.contains(value.toLowerCase())) {
			//throw new IllegalStateException( "Unexpected value: " + value);
			throw new InvalidDataException(
					"Unexpected value for Color: " + value, 
					new BeanPropertyBindingResult(value, ColorEnum.class.getName()));
		}
		
		return true;
		
	}  

}
