package br.gov.serpro.supde.infra.batch.sample;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;

import br.gov.serpro.supde.infra.batch.sample.domain.Experience;

/**
 * Exemplo de ItemProcessor.
 * O @see {@link ItemProcessor} serve para processar regras de negocios e converter um objeto em outro.
 * Alterar o tipo do objeto é opcional, ou seja, os tipos de entrada e saída podem ser iguais.
 * O tipo de "entrada" é o tipo criado no ItemReader, e o tipo de "saída" é enviado para o ItemWriter 
 * 
 * No exemplo, o objeto do tipo Experience está sendo convertido em um Experience 
 * (com escape das vírgulas para geração dos CSV).
 * 
 * @author 05601970475
 *
 */
public class SampleProcessor implements ItemProcessor<Experience, Experience> {
	
	private static Logger logger = LoggerFactory.getLogger(SampleProcessor.class);

	public Experience process(Experience experience) throws Exception {	
		logger.info("Thread #" + Thread.currentThread().getId() + " -> Executando SampleProcessor..." + experience);
		experience.setNome(sanitizeCsv(experience.getNome()));
		experience.setPais(sanitizeCsv(experience.getPais()));
		experience.setEmpresa(sanitizeCsv(experience.getEmpresa()));
		experience.setDepartamento(sanitizeCsv(experience.getDepartamento()));
		return experience;
	}
	
	private String sanitizeCsv(String value) {		
		if(value != null && value.contains(",")) {
			return  "\"" + value + "\"";
		}
		return value;
	}
	
}
