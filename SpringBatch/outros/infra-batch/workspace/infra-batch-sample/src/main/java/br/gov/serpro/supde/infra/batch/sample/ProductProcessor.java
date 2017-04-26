package br.gov.serpro.supde.infra.batch.sample;

import org.apache.commons.lang.SerializationUtils;
import org.postgresql.util.PGobject;
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
		/*
		String json = product.getJson() != null ? (String) SerializationUtils.clone(product.getJson()) : null; 
		if(json != null && 
				json.startsWith("{") && json.endsWith("}")){ 
			//Para type "json": "to_json(" + "jsonString" + "::json)"
			//Para type "jsonb": "$JSON$" + "jsonString" + "$JSON$"
			//product.setJson("$JSON$".concat(json).concat("$JSON$"));
			//product.setJson("\"$JSON$".concat(json).concat("$JSON$\""));
			//product.setJson(json);
			//product.setJson("\"".concat(json).concat("\""));
			/
			PGobject jsonObject = new PGobject();
			jsonObject.setType("jsonb");
			jsonObject.setValue(json);
			product.setJson(json);
			/
			//product.setJson("to_json(".concat(json).concat("::jsonb)"));
			//cast(:parameters AS JSON)
			//product.setJson("\"".concat(json).concat("\"").concat("::jsonb"));
			//product.setJson("cast(".concat(json).concat(" AS JSONB)"));
			//product.setJson(json);
		}*/
		product.setJson(product.getJson());
		
		return product;

	}

}
