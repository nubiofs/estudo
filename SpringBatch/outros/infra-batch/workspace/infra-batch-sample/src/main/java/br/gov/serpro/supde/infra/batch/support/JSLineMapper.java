package br.gov.serpro.supde.infra.batch.support;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.batch.item.file.LineMapper;

import br.gov.serpro.supde.infra.batch.sample.domain.Product;

public class JSLineMapper implements LineMapper<Product>   {

	@SuppressWarnings("unchecked")
	@Override
	public Product mapLine(String line, int lineNumber) throws Exception {

		Product product = null;
		
		try{
		
		if(JSONUtils.isJSONValid(line)){
			
			/*
			 * http://stackoverflow.com/questions/5490789/json-parsing-using-gson-for-java
			Each time gson sees a {}, it creates a Map (actually a gson StringMap )
			Each time gson sees a '', it creates a String
			Each time gson sees a number, it creates a Double
			Each time gson sees a [], it creates an ArrayList
			You can use this facts (combined) to your advantage
			*/
			Map<String, Object> javaRootMapObject = JSONUtils.GSON.fromJson(line, Map.class);

			product = new Product();
			product.setId((Double) javaRootMapObject.get("id"));
			product.setName(String.valueOf(javaRootMapObject.get("name")));
			product.setBrand((String) javaRootMapObject.get("brand"));

			//if(javaRootMapObject.get("type") instanceof java.util.ArrayList){
			if(javaRootMapObject.get("type") instanceof java.util.List){
				//product.setType(Arrays.asList((java.util.ArrayList<String>) javaRootMapObject.get("type")).toString());
				product.setType(Arrays.asList((List<String>) javaRootMapObject.get("type")).toString());
			} else {
				product.setType((String) javaRootMapObject.get("type"));
			}
			
			product.setPrice((Double) javaRootMapObject.get("price"));
			product.setWarranty_years((Double) javaRootMapObject.get("warrantyyears"));
			product.setAvailable((Boolean) javaRootMapObject.get("available"));
			product.setDescription((String) javaRootMapObject.get("description"));
			
			System.out.println("lineNumber: " + lineNumber + "; Product = " + product.toString());

		}
		
		}catch(Exception e){
			System.out.println(e.getMessage());
		}

		return product;

	}

}
