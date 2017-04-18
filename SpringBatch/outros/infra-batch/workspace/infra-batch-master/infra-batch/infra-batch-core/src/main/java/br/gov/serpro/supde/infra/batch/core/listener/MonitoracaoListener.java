package br.gov.serpro.supde.infra.batch.core.listener;

import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;

import org.apache.commons.lang.time.DurationFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.StepExecution;

public class MonitoracaoListener implements JobExecutionListener {
	
	private static Logger logger = LoggerFactory.getLogger(MonitoracaoListener.class);
	
	@Override
	public void beforeJob(JobExecution jobExecution) {
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		
		int totalReads = 0;
		int totalWrites = 0;
		int totalCommits = 0;
		int totalRollbacks = 0;
		int totalReadSkips = 0;
		int totalWriteSkips = 0;
		int totalProcessSkips = 0;
		
		logger.info("############################### Monitoração ###############################");
		
		String jobName = "[Job " + jobExecution.getJobInstance().getJobName() + "]";		
		
		logger.info(jobName + " Instance: "	+ jobExecution.getJobInstance().getId());
		logger.info(jobName + " Parameters: " + jobExecution.getJobParameters());		
		logger.info(jobName + " Execution: " + jobExecution.getId());
		
		Collection<StepExecution> steps = jobExecution.getStepExecutions();
		if (steps != null) {
			for (StepExecution step : steps) {
				try {
					final Date startTime = step.getStartTime();
					final Date endTime = step.getEndTime();
					final String duration = DurationFormatUtils.formatDurationWords((endTime.getTime()-startTime.getTime()), true, true);
					
					// Não contabiliza as partições criadas para o processamento em paralelo. 
					if (!step.getStepName().matches("(.*)partition\\d+")) {
						totalReads += step.getReadCount();
						totalWrites += step.getWriteCount();
						totalCommits += step.getCommitCount();
						totalRollbacks += step.getRollbackCount();
						totalReadSkips += step.getReadSkipCount();
						totalWriteSkips += step.getWriteSkipCount();
						totalProcessSkips += step.getProcessSkipCount();
					}
					
					String stepName = "[Step " + step.getStepName() + "]";
										
					logger.info(stepName + " Start Time: " + sdf.format(startTime));
					logger.info(stepName + " End Time: " +	sdf.format(endTime));
					logger.info(stepName + " Duration: " + duration);
					logger.info(stepName + " Summary: " + step.getSummary());
					} catch(Exception e) {
						
					}
			}
		}
		final Date startTime = jobExecution.getStartTime();
		final Date endTime = jobExecution.getEndTime();
		final String duration = DurationFormatUtils.formatDurationWords((endTime.getTime()-startTime.getTime()), true, true);
		
		logger.info(jobName + " Start Time: " + sdf.format(startTime));
		logger.info(jobName + " End Time: " + sdf.format(endTime));
		logger.info(jobName + " Duration: " + duration);
		logger.info(jobName + " Reads: " + totalReads);
		logger.info(jobName + " Writes: " + totalWrites);
		logger.info(jobName + " Commits: " + totalCommits);
		logger.info(jobName + " Rollbacks: " + totalRollbacks);
		logger.info(jobName + " ReadSkips: " + totalReadSkips);
		logger.info(jobName + " WriteSkips: " + totalWriteSkips);
		logger.info(jobName + " ProcessSkips: " + totalProcessSkips);
		
		BatchStatus batchStatus = jobExecution.getStatus();
		if(batchStatus != null) {
			logger.info(jobName + " Status: " + batchStatus.name());			
		}
		
		ExitStatus exitStatus = jobExecution.getExitStatus();
		if(exitStatus != null) {
			logger.info(jobName + " ExitCode: " + exitStatus.getExitCode());
			logger.info(jobName + " ExitDescription: " + exitStatus.getExitDescription());
		}
		
		logger.info("############################### Monitoração ###############################");
				
	}
}
