package br.gov.serpro.supde.infra.batch.support;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.file.LineMapper;

import br.gov.serpro.supde.infra.batch.sample.domain.Product;
import br.gov.serpro.supde.infra.batch.util.JSONUtils;

import com.google.gson.JsonSyntaxException;

public class JSLineMapper implements LineMapper<Product>   {

	private static Logger logger = LoggerFactory.getLogger(JSLineMapper.class);
	
	@Override
	public Product mapLine(String line, int lineNumber) throws Exception {

		Product product = null;

		try{

			JSONUtils.GSON.fromJson(line, Object.class);

			JSONObject jsObject = new JSONObject(line);

			Set<String> list = new HashSet<String>();
			if(jsObject.has("type")){
				JSONArray arrayType = jsObject.optJSONArray("type");
				for(int i=0; i < arrayType.length(); i++){
					list.add((String) arrayType.optString(i));
				}
			}

			product = Product.getBuilder()
					//
					//Valores obrigatorios
					//
					.id((Integer) jsObject.get("id"))
					.name((String) jsObject.get("name"))
					//Nesse caso, o json é a propria linha
					.json((String) line)
					//
					//Valores opcionais
					//
					.brand(jsObject.has("brand") == true ? (String) jsObject.optString("brand") : null)
					.type(!list.isEmpty() ? StringUtils.join(list, ", ") : null)
					.color(jsObject.has("color") == true ? (String) jsObject.optString("color") : null)
					.price(jsObject.has("price") == true ? (Double) jsObject.optDouble("price") : null)
					.warranty_years(jsObject.has("warranty_years") == true ? (Double) jsObject.optDouble("warranty_years") : null)
					.available(jsObject.has("available") == true ? (Boolean) jsObject.optBoolean("available") : null)
					.description(jsObject.has("description") == true ? (String) jsObject.optString("description") : null)
					.build();
			
		}
		catch(JsonSyntaxException e){
			loggerPrint(lineNumber, e.getMessage());
			throw e;
		}
		catch(JSONException e){
			loggerPrint(lineNumber, e.getMessage());
			throw e;
		}
		catch(NumberFormatException e){
			loggerPrint(lineNumber, e.getMessage());
			throw e;
		}
		catch(Exception e){
			loggerPrint(lineNumber, e.getMessage());
			throw e;
		}
		
		return product;

	}
	
	private void loggerPrint(int lineNumber, String msg){
		logger.info(Thread.currentThread().getId() + " (lineNumber: " + lineNumber + ") -> JsonSyntaxException: " + msg);
	}

}
