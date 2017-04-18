package br.gov.serpro.supde.infra.batch.sample;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;

public class SampleStepExecutionListener implements StepExecutionListener {

	private static Logger logger = LoggerFactory.getLogger(SampleStepExecutionListener.class);
	
	@Override
	public void beforeStep(StepExecution stepExecution) {
		logger.info("BeforeStep - " + stepExecution.getStepName());
		
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		logger.info("AfterStep - " + stepExecution.getStepName());
		return null;
	}

}
