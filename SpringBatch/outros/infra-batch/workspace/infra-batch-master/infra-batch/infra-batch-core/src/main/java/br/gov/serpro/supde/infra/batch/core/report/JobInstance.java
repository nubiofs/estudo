package br.gov.serpro.supde.infra.batch.core.report;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * Uma instância de um Job.
 * </p>
 * 
 */
public class JobInstance {

	private static final JobExecutionStartTimeComparator comparator = new JobExecutionStartTimeComparator();
	
	/**
	 * Nùmero que identifica uma instância
	 */
	private final Long jobInstanceId;
	
	/**
	 * Nome do Job
	 */
	private final String jobName;
	
	/**
	 * Parâmetros de execução usados para iniciar uma execução dessa instância
	 */
	private final List<JobParameter> jobParameters = new ArrayList<JobParameter>();
	
	/**
	 * Lista de execuções dessa instância
	 */
	private final List<JobExecution> jobExecutions = new ArrayList<JobExecution>();
	
	public JobInstance(org.springframework.batch.core.JobInstance jobInstance, List<org.springframework.batch.core.JobExecution> jobExecutions) {
		this.jobInstanceId = jobInstance.getId();
		this.jobName = jobInstance.getJobName();
		this.addAll(jobExecutions);
	}

	private void addAll(List<org.springframework.batch.core.JobExecution> jobExecutions) {
		JobExecution jobExecution; 
		
		for (org.springframework.batch.core.JobExecution iJobExecution: jobExecutions) {
			jobExecution = new JobExecution(iJobExecution);			
			this.jobExecutions.add(jobExecution);
			addAll(iJobExecution.getJobParameters());		
		}

		Collections.sort(this.jobExecutions, comparator);
	}

	private void addAll(org.springframework.batch.core.JobParameters jobParameters) {
		Map<String, org.springframework.batch.core.JobParameter> parameters = jobParameters.getParameters();
		
		JobParameter jobParameter;
		org.springframework.batch.core.JobParameter iJobParameter;
		String value;
		
		for (String key : parameters.keySet()) {
			iJobParameter = parameters.get(key);
			value = getValue(iJobParameter);
			jobParameter = new JobParameter(key, value);
			this.jobParameters.add(jobParameter);
		}
		
	}

	private String getValue(org.springframework.batch.core.JobParameter iJobParameter) {
		org.springframework.batch.core.JobParameter.ParameterType type = iJobParameter.getType();
		String value;
		
		switch (type) {
			case DATE: {
				Date date = (Date) iJobParameter.getValue();
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
				value = simpleDateFormat.format(date);
			}
			break;
			
			default: {
				value = iJobParameter.getValue().toString();
			}
			break;
		}
		
		return value;
	}

	/**
	 * @return the jobInstanceId
	 */
	public Long getJobInstanceId() {
		return jobInstanceId;
	}

	/**
	 * @return the jobName
	 */
	public String getJobName() {
		return jobName;
	}

	/**
	 * @return the jobParameters
	 */
	public List<JobParameter> getJobParameters() {
		return Collections.unmodifiableList(new ArrayList<JobParameter>(jobParameters));
	}
	
	public List<JobExecution> getJobExecutions() {
		return Collections.unmodifiableList(new ArrayList<JobExecution>(jobExecutions));
	}
	
}
