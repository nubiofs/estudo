package br.gov.serpro.supde.infra.batch.support;

import java.util.HashSet;
import java.util.Set;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.validation.BeanPropertyBindingResult;

import br.gov.serpro.supde.infra.batch.util.InvalidDataException;
import br.gov.serpro.supde.infra.batch.util.TypeEnum;

public class TypeAcceptedValidator  implements ConstraintValidator<TypeAccepted, String>{

	private Set<String> valueList;

	@Override
	public void initialize(TypeAccepted constraint) {
		valueList = new HashSet<String>();  
		for (TypeEnum val : TypeEnum.values()) {  
			valueList.add(val.value.toLowerCase());  
		}
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

		//Devido Array de Strings para "type":
		//Validação possiveis valores de dominio para "type"
		for(String type : value.split(",")){
			type = type.trim();
			if (!valueList.contains(type.toLowerCase())) {
				throw new InvalidDataException(
						"Unexpected value for Type: " + type, 
						new BeanPropertyBindingResult(type, TypeEnum.class.getName()));
			}
		}
		
		return true;
		
	}  

}
