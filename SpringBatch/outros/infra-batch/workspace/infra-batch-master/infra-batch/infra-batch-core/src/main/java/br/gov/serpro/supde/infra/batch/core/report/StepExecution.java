package br.gov.serpro.supde.infra.batch.core.report;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * Uma execução de um passo de um Job
 * </p>
 * 
 */
public class StepExecution {

	/**
	 * Número que identifica a execução do passo
	 */
	private final Long stepExecutionId;
	
	/**
	 * Nome do passo
	 */
	private final String stepName;
	
	/**
	 * Status do passo
	 */
	private final String status;
	
	/**
	 * Código de saída do passo
	 */
	private final String exitCode;
	
	/**
	 * Mensagem de saída do passo
	 */
	private final String exitDescription;
	
	/**
	 * Quantidade de itens lidos no passo
	 */
	private final Integer readCount;
	
	/**
	 * Quantidade de itens escritos no passo
	 */
	private final Integer writeCount;
	
	/**
	 * Quantidade de commits efetuados no passo
	 */
	private final Integer commitCount;
	
	/**
	 * Quantidade de rollbacks efetuados no passo
	 */
	private final Integer rollbackCount;
	
	/**
	 * Quantidade de skips realizados no passo
	 */
	private final Integer skipCount;

	/**
	 * Quantidade de filtros realizados no passo
	 */
    private final Integer filterCount;
    
	/**
	 * Data/hora de início da execução do passo
	 */
	private final Date startTime;

	/**
	 * Data/hora de fim da execução do passo
	 */
	private final Date endTime;

	/**
	 * Duração da execução do passo
	 */
    private final String duration;
    
	/**
	 * Lista de exceções levantadas durante a execução do passo
	 */
	private final List<Throwable> failureExceptions = new ArrayList<Throwable>();
	
	public StepExecution(org.springframework.batch.core.StepExecution stepExecution) {
		this.stepExecutionId = stepExecution.getId();
		this.stepName = stepExecution.getStepName();
		this.status = stepExecution.getStatus().toString();
		this.exitCode = stepExecution.getExitStatus().getExitCode();
		this.exitDescription = stepExecution.getExitStatus().getExitDescription();
		this.readCount = stepExecution.getReadCount();
		this.writeCount = stepExecution.getWriteCount();
		this.commitCount = stepExecution.getCommitCount();
		this.rollbackCount = stepExecution.getRollbackCount();
		this.skipCount = stepExecution.getSkipCount();
		this.filterCount = stepExecution.getFilterCount();
		this.startTime = stepExecution.getStartTime();
		this.endTime = stepExecution.getEndTime();
		this.duration = JobReportUtil.getDurationBetween(startTime, endTime);
		this.addAll(stepExecution.getFailureExceptions());
	}

	private void addAll(List<Throwable> failureExceptions) {
		
		for (Throwable throwable: failureExceptions) {
			this.failureExceptions.add(throwable);
		}
		
	}

	/**
	 * @return the stepExecutionId
	 */
	public Long getStepExecutionId() {
		return stepExecutionId;
	}

	/**
	 * @return the stepName
	 */
	public String getStepName() {
		return stepName;
	}

	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * @return the exitCode
	 */
	public String getExitCode() {
		return exitCode;
	}
	
	/**
	 * @return the exitDescription
	 */
	public String getExitDescription() {
		return exitDescription;
	}
	
	/**
	 * @return the readCount
	 */
	public Integer getReadCount() {
		return readCount;
	}

	/**
	 * @return the writeCount
	 */
	public Integer getWriteCount() {
		return writeCount;
	}

	/**
	 * @return the commitCount
	 */
	public Integer getCommitCount() {
		return commitCount;
	}

	/**
	 * @return the rollbackCount
	 */
	public Integer getRollbackCount() {
		return rollbackCount;
	}

	/**
	 * @return the startTime
	 */
	public Date getStartTime() {
		return startTime;
	}

	/**
	 * @return the endTime
	 */
	public Date getEndTime() {
		return endTime;
	}

	/**
	 * @return the duration
	 */
	public String getDuration() {
		return duration;
	}

	/**
	 * @return the skipCount
	 */
	public Integer getSkipCount() {
		return skipCount;
	}

	/**
	 * @return the filterCount
	 */
	public Integer getFilterCount() {
		return filterCount;
	}
	
	public List<Throwable> getFailureExceptions() {
		return Collections.unmodifiableList(new ArrayList<Throwable>(failureExceptions));
	}
	
}
