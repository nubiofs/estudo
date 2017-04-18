package br.gov.serpro.supde.infra.batch.core.concurrent;

import org.springframework.batch.core.Step;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.partition.support.PartitionStep;
import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.core.partition.support.SimpleStepExecutionSplitter;
import org.springframework.batch.integration.partition.MessageChannelPartitionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

public class JMSPartitionStep extends PartitionStep {
	
	private Step step;

	private Partitioner partitioner;

	@Autowired(required=true)	
	private MessageChannelPartitionHandler jmsPartitionHandler;
	
	public Step getStep() {
		return step;
	}

	public void setStep(Step step) {
		this.step = step;
	}

	public Partitioner getPartitioner() {
		return partitioner;
	}

	public void setPartitioner(Partitioner partitioner) {
		this.partitioner = partitioner;
	}
	
	public void setJmsPartitionHandler(MessageChannelPartitionHandler jmsPartitionHandler) {
		this.jmsPartitionHandler = jmsPartitionHandler;
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(step);
		Assert.notNull(partitioner);
				
		jmsPartitionHandler.setStepName(step.getName());	
		super.setPartitionHandler(jmsPartitionHandler);		
		super.setStepExecutionSplitter(new SimpleStepExecutionSplitter(getJobRepository(), step.isAllowStartIfComplete(), step.getName(), partitioner));
		super.afterPropertiesSet();
	}

	@Override
	protected void doExecute(StepExecution stepExecution) throws Exception {		
		super.doExecute(stepExecution);
	}

}
