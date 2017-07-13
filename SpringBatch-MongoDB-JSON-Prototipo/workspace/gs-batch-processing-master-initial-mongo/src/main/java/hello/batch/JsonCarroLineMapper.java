package hello.batch;

import hello.pojo.Carro;

import java.util.Map;

import org.springframework.batch.item.file.LineMapper;
import org.springframework.batch.item.file.mapping.JsonLineMapper;

/**
 * This line mapper converts a JSON string to a {@link Carro}. 
 */
public class JsonCarroLineMapper implements LineMapper<Carro> {

	//@Autowired private org.springframework.batch.item.file.mapping.JsonLineMapper delegate;
	private JsonLineMapper delegate = new JsonLineMapper();
	
	@Override
	public Carro mapLine(String line, int lineNumber) throws Exception {
		
		//JSON
		Map<String, Object> carroAsMap = (Map<String, Object>) delegate.mapLine(line, lineNumber);

		Carro carro = new Carro();
		carro.setKm((String) carroAsMap.get("km"));
		carro.setNome((String) carroAsMap.get("nome"));

		return carro;

	}

}
