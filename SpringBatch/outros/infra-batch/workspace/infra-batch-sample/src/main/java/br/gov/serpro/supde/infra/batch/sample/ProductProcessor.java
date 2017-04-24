package br.gov.serpro.supde.infra.batch.sample;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.batch.item.ItemProcessor;

import br.gov.serpro.supde.infra.batch.sample.domain.Product;
import br.gov.serpro.supde.infra.batch.support.TYPE;

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

		product.setId(product.getId());
		product.setName(product.getName());
		product.setBrand(product.getBrand());
		
		//Validação possiveis valores de dominio para "type"
		Set<String> list = new HashSet<String>();
		for(String type : product.getType().split(",")){
			type = type.trim();
			for(TYPE tp: TYPE.values()){
				if(type.equals(tp.value)){
					list.add(type);
					break;
				}
			}
			if(!list.contains(type)){
				throw new Exception("(" + type + ") Nao é um TYPE!");
			}
		}
		product.setType(list.isEmpty() ? "" : StringUtils.join(list, ", "));
		
		product.setPrice(product.getPrice());
		product.setWarranty_years(product.getWarranty_years());
		product.setAvailable(product.getAvailable());
		product.setDescription(product.getDescription());

		return product;

	}
	
	private void isNumeric(String str, Class<? extends Number> clazz) throws NumberFormatException	{
		try
		{
			if (clazz.equals(Double.class)) {
				Double.parseDouble(str);
			}
			else if (clazz.equals(Integer.class)) {
				Integer.parseInt(str);
			}
			else if (clazz.equals(Long.class)) {
				Long.parseLong(str);
			}
		}
		catch (NumberFormatException nfe) {
			//LOG.debug(str + " is not a valid number.");
			//return false;
			throw nfe;
		}
	 	//return true;
	}

}
