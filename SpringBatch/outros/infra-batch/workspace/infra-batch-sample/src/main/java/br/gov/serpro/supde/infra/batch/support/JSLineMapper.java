package br.gov.serpro.supde.infra.batch.support;

import org.springframework.batch.item.file.LineMapper;
import br.gov.serpro.supde.infra.batch.sample.domain.Product;

public class JSLineMapper implements LineMapper<Product>   {

	@Override
	public Product mapLine(String line, int lineNumber) throws Exception {

		//teste+
		//Product product = null;
		Product product = new Product();
		//teste-

		if(JSONUtils.isJSONValid(line)){

			product = JSONUtils.getProduct();
			
			if(product != null){
				System.out.println("lineNumber: " + lineNumber + "; Product = " + product.toString());
			}
			
		}

		return product;

	}

}
