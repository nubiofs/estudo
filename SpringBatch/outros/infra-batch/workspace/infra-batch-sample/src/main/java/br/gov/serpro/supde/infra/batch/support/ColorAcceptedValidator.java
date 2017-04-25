package br.gov.serpro.supde.infra.batch.support;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class ColorAcceptedValidator  implements ConstraintValidator<ColorAccepted, String>{

//	private final List<String> valueList = new ArrayList<String>(Arrays.asList(
//			ColorEnum.BLACK.value,
//			ColorEnum.GREEN.value,
//			ColorEnum.RED.value));
	
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

		//context.disableDefaultConstraintViolation();
		
		if (!valueList.contains(value.toLowerCase())) {
			throw new IllegalStateException( "Unexpected value: " + value);
		}
		
		return true;
		
	}  

}
