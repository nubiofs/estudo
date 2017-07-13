package hello.batch;

import hello.pojo.Carro;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;

//There is no requirement that the input and output types be the same. 
public class CarroItemProcessor implements ItemProcessor<Carro, Carro>{
	
	private static final Logger log = LoggerFactory.getLogger(CarroItemProcessor.class);

	@Override
	public Carro process(Carro item) throws Exception {
		
		final String kmRod = item.getKm();
        final String nome = item.getNome().toUpperCase();

        final Carro transformedCarro = new Carro(kmRod, nome);

        log.info("Converting (" + item + ") into (" + transformedCarro + ")");

        return transformedCarro;
        
	}

}
