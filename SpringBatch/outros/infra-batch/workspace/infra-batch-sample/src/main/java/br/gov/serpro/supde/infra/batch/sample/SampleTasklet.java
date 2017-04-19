package br.gov.serpro.supde.infra.batch.sample;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;

/**
 * Exemplo de Tasklet.
 * 
 * @see {@link Tasklet}
 * @author 05601970475
 *
 */
public class SampleTasklet implements Tasklet {
	
	private static Logger logger = LoggerFactory.getLogger(SampleTasklet.class);
	
	//Carrega as mensagens do arquivo /messages/application-messages.properties
	@Autowired
	private MessageSource messageSource;

	public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
		
		logger.info("Thread #" + Thread.currentThread().getId() + " -> Executando SampleTasklet...");		
		System.out.println("=================================================");
		System.out.println(messageSource.getMessage("exemplo_mensagem", new Object[] {}, null));
		System.out.println("=================================================");
		
		return RepeatStatus.FINISHED;
		
	}

}
