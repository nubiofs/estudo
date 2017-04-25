package br.gov.serpro.supde.infra.batch.sample;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.batch.item.ItemProcessor;

import br.gov.serpro.supde.infra.batch.sample.domain.Product;
import br.gov.serpro.supde.infra.batch.util.InvalidDataException;
import br.gov.serpro.supde.infra.batch.util.TypeEnum;
import br.gov.serpro.supde.infra.batch.util.ValidatorUtil;

/**
 * Exemplo de ItemProcessor.
 * O @see {@link ItemProcessor} serve para processar regras de negocios e converter um objeto em outro.
 * Alterar o tipo do objeto é opcional, ou seja, os tipos de entrada e saída podem ser iguais.
 * O tipo de "entrada" é o tipo criado no ItemReader, e o tipo de "saída" é enviado para o ItemWriter 
 * 
 * No exemplo, o objeto do tipo Product está sendo convertido em um Product 
 * (com escape das vírgulas para geração dos CSV).
 * 
 * @author 05601970475
 *
 */
public class ProductProcessor implements ItemProcessor<Product, Product> {

	public Product process(Product product) throws Exception {	

//		BindingResult results = BindAndValidate(product);  
//        if (results.hasErrors()){  
//             buildValidationException(results);
//        }
		//
		//
		//
//		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
//		Validator validator = (Validator) factory.getValidator();
//		//Set<ConstraintViolation<?>> constraints = validator.validate(product, new org.springframework.validation.Errors(""));
//		Set<ConstraintViolation<?>> constraints = validator.validate(product, new Errors());
//		for (ConstraintViolation<?> violation:constraints) {
//		    violation.getMessage();
//		    violation.getInvalidValue();
//		    violation.getPropertyPath();
//		}

		product = (Product) ValidatorUtil.validate(product);
		
		product.setId(product.getId());
		product.setName(product.getName());
		product.setBrand(product.getBrand());

		//Validação possiveis valores de dominio para "type"
		Set<String> list = new HashSet<String>();
		for(String type : product.getType().split(",")){
			type = type.trim();
			for(TypeEnum tp: TypeEnum.values()){
				if(type.equals(tp.value)){
					list.add(type);
					break;
				}
			}
			if(!list.contains(type)){
				throw new Exception("(" + type + ") Nao é um TYPE!");
			}
		}
		product.setType(!list.isEmpty() ? StringUtils.join(list, ", ") : null);

		//product.setColor(product.getColor() != null ? product.getColor().toUpperCase() : null);
		product.setColor(product.getColor());
		product.setPrice(product.getPrice());
		product.setWarranty_years(product.getWarranty_years());
		product.setAvailable(product.getAvailable());
		product.setDescription(product.getDescription());

		return product;

	}

//    public void setValidator(Validator validator) {  
//         this.validator = validator;  
//    }  
//	
//	@Autowired(required=true)
//    private Validator validator;
//	
//	private BindingResult BindAndValidate(Product product) {  
//
//		DataBinder binder = new DataBinder(product);
//		binder.setValidator(validator);
//		
//		//teste
//		//binder.setIgnoreUnknownFields(true);
////		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
////		//cache the factory somewhere
////		Validator validator = (Validator) factory.getValidator();
////		//LocalValidatorFactoryBean factory = new LocalValidatorFactoryBean();
////		binder.setValidator(validator);
//		//teste-
//		
//		//binder.setValidator(validator);
//		//binder.setValidator(new org.springframework.validation.beanvalidation.LocalValidatorFactoryBean());
//		//binder.setValidator(new AcceptedValidator());
//
//		binder.validate();  
//
//		return binder.getBindingResult();  
//
//	}  

//	private void buildValidationException(BindingResult results) {  
//		StringBuilder msg = new StringBuilder();  
//		for (ObjectError error : results.getAllErrors()) {  
//			msg.append("-*-*-*- \n" + error.toString() + "-*-*-*- \n");  
//		}  
//		throw new ValidationException(msg.toString());  
//	}  

	//	private void isNumeric(String str, Class<? extends Number> clazz) throws NumberFormatException	{
	//		try
	//		{
	//			if (clazz.equals(Double.class)) {
	//				Double.parseDouble(str);
	//			}
	//			else if (clazz.equals(Integer.class)) {
	//				Integer.parseInt(str);
	//			}
	//			else if (clazz.equals(Long.class)) {
	//				Long.parseLong(str);
	//			}
	//		}
	//		catch (NumberFormatException nfe) {
	//			//LOG.debug(str + " is not a valid number.");
	//			//return false;
	//			throw nfe;
	//		}
	//	 	//return true;
	//	}

}
