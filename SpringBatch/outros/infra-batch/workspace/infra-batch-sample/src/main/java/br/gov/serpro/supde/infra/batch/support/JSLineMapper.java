package br.gov.serpro.supde.infra.batch.support;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.batch.item.file.LineMapper;

import br.gov.serpro.supde.infra.batch.sample.domain.Product;

import com.google.gson.JsonSyntaxException;

public class JSLineMapper implements LineMapper<Product>   {

	@Override
	public Product mapLine(String line, int lineNumber) throws Exception {

		Product product = null;

		try{

			/*
			 * http://stackoverflow.com/questions/5490789/json-parsing-using-gson-for-java
			Each time gson sees a {}, it creates a Map (actually a gson StringMap )
			Each time gson sees a '', it creates a String
			Each time gson sees a number, it creates a Double
			Each time gson sees a [], it creates an ArrayList
			You can use this facts (combined) to your advantage
			 */
			/*
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
			 */

			JSONUtils.GSON.fromJson(line, Object.class);

			product = new Product();

			JSONObject jsObject = new JSONObject(line);

			//Valores obrigatorios
			product.setId(jsObject.getInt("id"));
			product.setName(jsObject.getString("name"));

			//
			//Valores opcionais
			//
			if(jsObject.has("brand")){
				product.setBrand(jsObject.optString("brand"));
			}

			if(jsObject.has("type")){
				JSONArray arrayType = jsObject.optJSONArray("type");
				List<String> list = new ArrayList<String>();
				for(int i=0; i < arrayType.length(); i++){
					list.add(arrayType.optString(i));
				}
				product.setType(list.isEmpty() ? "" : StringUtils.join(list, ", "));
			}

			if(jsObject.has("price")){
				product.setPrice(jsObject.optDouble("price"));
			}

			if(jsObject.has("warranty_years")){
				product.setWarranty_years(jsObject.optDouble("warranty_years"));
			}

			if(jsObject.has("available")){
				product.setAvailable(jsObject.optBoolean("available"));
			}

			if(jsObject.has("description")){
				product.setDescription(jsObject.optString("description"));
			}

			System.out.println("lineNumber: " + lineNumber + "; Product = " + product.toString());

		}
		catch(JsonSyntaxException e){
			throw e;
		}
		catch(JSONException e){
			throw e;
		}

		return product;

	}

}
