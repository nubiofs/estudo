package br.gov.serpro.supde.infra.batch.core.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;

import br.gov.serpro.supde.infra.batch.core.constant.MessageKeys;
import br.gov.serpro.supde.infra.batch.core.context.InfraJobContext;

/**
 * Listener para todos os Jobs.
 * Antes de executar o job, verifica se as triggers estão habilitadas (casos do SIEF), 
 * 
 * @author 05601970475
 *
 */
public class InfraJobListener implements JobExecutionListener {

	private static Logger logger = LoggerFactory.getLogger(InfraJobListener.class);
	
	@Autowired
	private MessageSource messageSource;		
	
	/**
	 * Contexto de execução do Job.
	 */
	private InfraJobContext infraJobContext = InfraJobContext.getInstance();
	
	/**
	 * Método executado antes do primeiro step do Job.
	 * @param jobExecution
	 */
	public void beforeJob(JobExecution jobExecution) {
		logger.info(messageSource.getMessage(MessageKeys.BEFORE_JOB, null, null));
		logger.info(infraJobContext.toString());
		
		infraJobContext.setJobExecution(jobExecution);
	}

	/**
	 * Método executado após a finalização do Job.
	 * @param jobExecution
	 */
	public void afterJob(JobExecution jobExecution) {
		logger.info(messageSource.getMessage(MessageKeys.AFTER_JOB, null, null));		
	}
	
}
