package br.gov.serpro.supde.infra.batch.sample;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import br.gov.serpro.supde.infra.batch.sample.domain.Experience;

/**
 * Exemplo de ItemWriter.
 * 
 * @see {@link ItemWriter}
 * @author 05601970475
 *
 */
public class SampleWriter implements ItemWriter<Experience> {

	private static Logger logger = LoggerFactory.getLogger(SampleWriter.class);
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	public void write(List<? extends Experience> items) throws Exception {
		logger.info("Thread #" +Thread.currentThread().getId() + " Escrevendo experiences...");
		
		for(Experience item : items) {			
			logger.info("Thread #" +Thread.currentThread().getId() + " -> " + item);
			//TODO montar sql[]
		}
		//TODO executar batchUpdate
		//jdbcTemplate.batchUpdate(sql[]);
	}

}
