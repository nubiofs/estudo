package br.gov.serpro.supde.infra.batch.support;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.file.LineMapper;

import br.gov.serpro.supde.infra.batch.sample.domain.Product;

import com.google.gson.JsonSyntaxException;

public class JSLineMapper implements LineMapper<Product>   {

	private static Logger logger = LoggerFactory.getLogger(JSLineMapper.class);
	
	@Override
	public Product mapLine(String line, int lineNumber) throws Exception {

		Product product = null;

		try{

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
			loggerPrint(lineNumber, e.getMessage());
			throw e;
		}
		catch(JSONException e){
			loggerPrint(lineNumber, e.getMessage());
			throw e;
		}

		return product;

	}
	
	private void loggerPrint(int lineNumber, String msg){
		logger.info(Thread.currentThread().getId() + " (lineNumber: " + lineNumber + ") -> JsonSyntaxException: " + msg);
	}

}
