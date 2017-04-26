package br.gov.serpro.supde.infra.batch.sample;

import org.springframework.batch.item.ItemProcessor;

import br.gov.serpro.supde.infra.batch.sample.domain.Product;
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

		product = (Product) ValidatorUtil.validate(product);

		product.setId(product.getId());
		product.setName(product.getName());
		product.setBrand(product.getBrand());
		product.setType(product.getType());
		product.setColor(product.getColor());
		product.setPrice(product.getPrice());
		product.setWarranty_years(product.getWarranty_years());
		product.setAvailable(product.getAvailable());
		product.setDescription(product.getDescription());
		product.setJson(product.getJson());
		
		return product;

	}

}
