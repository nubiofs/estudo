package hello.batch;

import hello.pojo.Carro;

import java.util.Map;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.file.LineMapper;
import org.springframework.batch.item.file.mapping.JsonLineMapper;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;


/**
 * This line mapper converts a JSON string to a {@link Carro}. 
 */
public class JsonCarroLineMapper implements LineMapper<Carro> {

	//@Autowired private org.springframework.batch.item.file.mapping.JsonLineMapper delegate;
	private JsonLineMapper delegate = new JsonLineMapper();

	private static Logger logger = LoggerFactory.getLogger(JsonCarroLineMapper.class);

	@Override
	public Carro mapLine(String line, int lineNumber) throws Exception {

		Carro carro = null;

		try {

			new Gson().fromJson(line, Object.class);

			JSONObject jsObject = new JSONObject(line);

			//JSON
			Map<String, Object> carroAsMap = (Map<String, Object>) delegate.mapLine(line, lineNumber);
			carro = new Carro();
			
			if(jsObject.has("km") && jsObject.has("nome")){//Verificação campos obrigatorios
				carro.setKm((String) carroAsMap.get("km"));
				carro.setNome((String) carroAsMap.get("nome"));
			}

		} catch(JsonSyntaxException ex) {
			logger.info(Thread.currentThread().getId() + " (lineNumber: " + lineNumber + ") -> Exception: " + ex.getMessage());
			throw ex;
		} catch(JSONException ex){
			logger.info(Thread.currentThread().getId() + " (lineNumber: " + lineNumber + ") -> Exception: " + ex.getMessage());
			throw ex;
		}

		return carro;

	}

}
