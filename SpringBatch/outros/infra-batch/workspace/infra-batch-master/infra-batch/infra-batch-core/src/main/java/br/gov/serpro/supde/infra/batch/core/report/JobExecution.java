package br.gov.serpro.supde.infra.batch.core.report;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * Uma execução de um Job.
 * </p>
 * 
 */
public class JobExecution {

	private static final StepExecutionStartTimeComparator comparator = new StepExecutionStartTimeComparator();

	/**
	 * Número identificador da execução
	 */
	private final Long jobExecutionId;
	
	/**
	 * Status da execução
	 */
	private final String status;
	
	/**
	 * Data/hora de início da execução
	 */
    private final Date startTime;

    /**
	 * Data/hora de fim da execução
	 */
    private final Date endTime;

	/**
	 * Duração da execução
	 */
    private final String duration;

	/**
	 * Código de saída da execução
	 */
    private final String exitCode;
    
	/**
	 * Mensagem de saída da execução
	 */
    private final String exitDescription;
    
    /**
     * Lista da execução dos passos
     */
    private final List<StepExecution> stepExecutions = new ArrayList<StepExecution>();

    /**
     * Lista das exceções da execução
     */
    private final List<Throwable> failureExceptions = new ArrayList<Throwable>();
 
    public JobExecution(org.springframework.batch.core.JobExecution jobExecution) {
    	this.jobExecutionId = jobExecution.getId();
    	this.status = jobExecution.getStatus().toString();
    	this.startTime = jobExecution.getStartTime();
    	this.endTime = jobExecution.getEndTime();
    	this.duration = JobReportUtil.getDurationBetween(startTime, endTime);
    	this.exitCode = jobExecution.getExitStatus().getExitCode();
    	this.exitDescription = jobExecution.getExitStatus().getExitDescription();
    	this.addAll(jobExecution.getStepExecutions());
    	this.addAll(jobExecution.getAllFailureExceptions());
	}

	/**
	 * @return the jobExecutionId
	 */
	public Long getJobExecutionId() {
		return jobExecutionId;
	}

	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
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
	 * @return the stepExecutions
	 */
	public List<StepExecution> getStepExecutions() {
		return Collections.unmodifiableList(new ArrayList<StepExecution>(stepExecutions));
	}

	/**
	 * @return the stepExecutions
	 */
	public List<Throwable> getFailureExceptions() {
		return Collections.unmodifiableList(new ArrayList<Throwable>(failureExceptions));
	}

	private void addAll(Collection<org.springframework.batch.core.StepExecution> stepExecutions) {
		StepExecution stepExecution;

		for (org.springframework.batch.core.StepExecution iStepExecution : stepExecutions) {
			stepExecution = new StepExecution(iStepExecution);
			this.stepExecutions.add(stepExecution);
		}

		Collections.sort(this.stepExecutions, comparator);
	}

	private void addAll(List<Throwable> failureExceptions) {
		
		for (Throwable throwable: failureExceptions) {
			this.failureExceptions.add(throwable);
		}
		
	}

}
