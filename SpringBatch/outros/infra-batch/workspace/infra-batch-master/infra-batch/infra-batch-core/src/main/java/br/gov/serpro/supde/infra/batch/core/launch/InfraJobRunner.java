package br.gov.serpro.supde.infra.batch.core.launch;

import java.io.PrintStream;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobInstance;
import org.springframework.batch.core.JobParameter;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersIncrementer;
import org.springframework.batch.core.configuration.JobLocator;
import org.springframework.batch.core.converter.DefaultJobParametersConverter;
import org.springframework.batch.core.converter.JobParametersConverter;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobExecutionNotFailedException;
import org.springframework.batch.core.launch.JobExecutionNotRunningException;
import org.springframework.batch.core.launch.JobExecutionNotStoppedException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.JobParametersNotFoundException;
import org.springframework.batch.core.launch.support.CommandLineJobRunner;
import org.springframework.batch.core.launch.support.ExitCodeMapper;
import org.springframework.batch.core.launch.support.SimpleJvmExitCodeMapper;
import org.springframework.batch.core.launch.support.SystemExiter;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import br.gov.serpro.supde.infra.batch.core.constant.SystemPropertyKeys;
import br.gov.serpro.supde.infra.batch.core.context.InfraJobContext;
import br.gov.serpro.supde.infra.batch.core.report.JobReportController;

/**
 * Classe que possui o método que será executado a partir da linha de comando 
 * para iniciar o processamento do Job. 
 * 
 * @author 05601970475
 *
 */
public class InfraJobRunner {
	
	protected static final Log logger = LogFactory.getLog(InfraJobRunner.class);
	
	private ExitCodeMapper exitCodeMapper = new SimpleJvmExitCodeMapper();

	private JobLauncher launcher;

	private JobLocator jobLocator;

	// Package private for unit test
	private static SystemExiter systemExiter = new InfraSystemExiter();

	private static String message = "";

	private JobParametersConverter jobParametersConverter = new DefaultJobParametersConverter();

	private JobExplorer jobExplorer;

	private JobRepository jobRepository;
	
	private ConfigurableApplicationContext context;
	
	private final static List<String> VALID_OPTS = Arrays.asList(new String [] {"-restart", "-next", "-stop", "-abandon", "-report"});
	
	public InfraJobRunner(String jobPath) {
		context = new ClassPathXmlApplicationContext(jobPath);
		context.getAutowireCapableBeanFactory().autowireBeanProperties(this, AutowireCapableBeanFactory.AUTOWIRE_BY_TYPE, false);
	}
	
	/**
	 * Injection setter for the {@link JobLauncher}.
	 *
	 * @param launcher the launcher to set
	 */
	public void setLauncher(JobLauncher launcher) {
		this.launcher = launcher;
	}

	/**
	 * @param jobRepository the jobRepository to set
	 */
	public void setJobRepository(JobRepository jobRepository) {
		this.jobRepository = jobRepository;
	}

	/**
	 * Injection setter for {@link JobExplorer}.
	 *
	 * @param jobExplorer the {@link JobExplorer} to set
	 */
	public void setJobExplorer(JobExplorer jobExplorer) {
		this.jobExplorer = jobExplorer;
	}

	/**
	 * Injection setter for the {@link ExitCodeMapper}.
	 *
	 * @param exitCodeMapper the exitCodeMapper to set
	 */
	public void setExitCodeMapper(ExitCodeMapper exitCodeMapper) {
		this.exitCodeMapper = exitCodeMapper;
	}

	/**
	 * Static setter for the {@link SystemExiter} so it can be adjusted before
	 * dependency injection. Typically overridden by
	 * {@link #setSystemExiter(SystemExiter)}.
	 *
	 * @param systemExiter
	 */
	public static void presetSystemExiter(SystemExiter systemExiter) {
		InfraJobRunner.systemExiter = systemExiter;
	}

	/**
	 * Retrieve the error message set by an instance of
	 * {@link CommandLineJobRunner} as it exits. Empty if the last job launched
	 * was successful.
	 *
	 * @return the error message
	 */
	public static String getErrorMessage() {
		return message;
	}

	/**
	 * Injection setter for the {@link SystemExiter}.
	 *
	 * @param systemExiter
	 */
	public void setSystemExiter(SystemExiter systemExiter) {
		InfraJobRunner.systemExiter = systemExiter;
	}

	/**
	 * Injection setter for {@link JobParametersConverter}.
	 *
	 * @param jobParametersConverter
	 */
	public void setJobParametersConverter(JobParametersConverter jobParametersConverter) {
		this.jobParametersConverter = jobParametersConverter;
	}

	/**
	 * Delegate to the exiter to (possibly) exit the VM gracefully.
	 *
	 * @param status
	 */
	public void exit(int status) {
		systemExiter.exit(status);
	}

	/**
	 * {@link JobLocator} to find a job to run.
	 * @param jobLocator a {@link JobLocator}
	 */
	public void setJobLocator(JobLocator jobLocator) {
		this.jobLocator = jobLocator;
	}
	
	public ConfigurableApplicationContext getContext() {
		return context;
	}

	/**
	 * @param jobIdentifier a job execution id or job name
	 * @param minStatus the highest status to exclude from the result
	 * @return
	 */
	private List<JobExecution> getJobExecutionsWithStatusGreaterThan(String jobIdentifier, BatchStatus minStatus) {

		Long executionId = getLongIdentifier(jobIdentifier);
		if (executionId != null) {
			JobExecution jobExecution = jobExplorer.getJobExecution(executionId);
			if (jobExecution.getStatus().isGreaterThan(minStatus)) {
				return Arrays.asList(jobExecution);
			}
			return Collections.emptyList();
		}

		int start = 0;
		int count = 100;
		List<JobExecution> executions = new ArrayList<JobExecution>();
		List<JobInstance> lastInstances = jobExplorer.getJobInstances(jobIdentifier, start, count);

		while (!lastInstances.isEmpty()) {

			for (JobInstance jobInstance : lastInstances) {
				List<JobExecution> jobExecutions = jobExplorer.getJobExecutions(jobInstance);
				if (jobExecutions == null || jobExecutions.isEmpty()) {
					continue;
				}
				for (JobExecution jobExecution : jobExecutions) {
					if (jobExecution.getStatus().isGreaterThan(minStatus)) {
						executions.add(jobExecution);
					}
				}
			}

			start += count;
			lastInstances = jobExplorer.getJobInstances(jobIdentifier, start, count);

		}

		return executions;

	}

	private JobExecution getLastFailedJobExecution(String jobIdentifier) {
		List<JobExecution> jobExecutions = getJobExecutionsWithStatusGreaterThan(jobIdentifier, BatchStatus.STOPPING);
		if (jobExecutions.isEmpty()) {
			return null;
		}
		return jobExecutions.get(0);
	}

	private List<JobExecution> getStoppedJobExecutions(String jobIdentifier) {
		List<JobExecution> jobExecutions = getJobExecutionsWithStatusGreaterThan(jobIdentifier, BatchStatus.STARTED);
		if (jobExecutions.isEmpty()) {
			return null;
		}
		List<JobExecution> result = new ArrayList<JobExecution>();
		for (JobExecution jobExecution : jobExecutions) {
			if (jobExecution.getStatus() != BatchStatus.ABANDONED) {
				result.add(jobExecution);
			}
		}
		return result.isEmpty() ? null : result;
	}

	private List<JobExecution> getRunningJobExecutions(String jobIdentifier) {
		List<JobExecution> jobExecutions = getJobExecutionsWithStatusGreaterThan(jobIdentifier, BatchStatus.COMPLETED);
		if (jobExecutions.isEmpty()) {
			return null;
		}
		List<JobExecution> result = new ArrayList<JobExecution>();
		for (JobExecution jobExecution : jobExecutions) {
			if (jobExecution.isRunning()) {
				result.add(jobExecution);
			}
		}
		return result.isEmpty() ? null : result;
	}

	private Long getLongIdentifier(String jobIdentifier) {
		try {
			return new Long(jobIdentifier);
		}
		catch (NumberFormatException e) {
			// Not an ID - must be a name
			return null;
		}
	}

	/**
	 * @param job the job that we need to find the next parameters for
	 * @return the next job parameters if they can be located
	 * @throws JobParametersNotFoundException if there is a problem
	 */
	private JobParameters getNextJobParameters(Job job) throws JobParametersNotFoundException {
		String jobIdentifier = job.getName();
		JobParameters jobParameters;
		List<JobInstance> lastInstances = jobExplorer.getJobInstances(jobIdentifier, 0, 1);

		JobParametersIncrementer incrementer = job.getJobParametersIncrementer();
		if (incrementer == null) {
			throw new JobParametersNotFoundException("No job parameters incrementer found for job=" + jobIdentifier);
		}

		if (lastInstances.isEmpty()) {
			jobParameters = incrementer.getNext(new JobParameters());
			if (jobParameters == null) {
				throw new JobParametersNotFoundException("No bootstrap parameters found from incrementer for job="
						+ jobIdentifier);
			}
		}
		else {
			List<JobExecution> lastExecutions = jobExplorer.getJobExecutions(lastInstances.get(0));
			jobParameters = incrementer.getNext(lastExecutions.get(0).getJobParameters());
		}
		return jobParameters;
	}
	
	private int getExitCode(JobExecution jobExecution) {
		
		ExitStatus exitStatus = jobExecution.getExitStatus();
		String exitDescription = exitStatus.getExitDescription();
		if(exitDescription != null && exitDescription.indexOf(":") > 0) {
			String businessCode = exitDescription.substring(0, exitDescription.indexOf(":"));
			try {
				return Integer.valueOf(businessCode.trim());
			} catch(Exception e) {
				logger.error("Erro ao obter exitBusinessCode da ExitDescription: [" + exitDescription + "]");					
			}
		} 
		
		return exitCodeMapper.intValue(exitStatus.getExitCode());
	}
	
	/*
	 * Start a job by obtaining a combined classpath using the job launcher and
	 * job paths. If a JobLocator has been set, then use it to obtain an actual
	 * job, if not ask the context for it.
	 */
	int start(String jobIdentifier, String[] parameters, Set<String> opts) {

		try {
			Assert.state(launcher != null, "Um JobLauncher deve ser definido. Verifique se seu job está importando o infra-batch-context.xml");
			if (opts.contains("-restart") || opts.contains("-next")) {
				Assert.state(jobExplorer != null,
						"Um JobExplorer deve ser definido. Verifique se seu job está importando o infra-batch-context.xml");
			}

			String jobName = jobIdentifier;

			JobParameters jobParameters = jobParametersConverter.getJobParameters(StringUtils
					.splitArrayElementsIntoProperties(parameters, "="));
			Assert.isTrue(parameters == null || parameters.length == 0 || !jobParameters.isEmpty(),
					"Parâmetros inválidos " + Arrays.asList(parameters)
					+ ". Os parâmetros devem ser informados no formato chave=valor (sem espaço em branco).");

			JobReportController reportController =  context.getBean(JobReportController.class);
			
			if(opts.contains("-report")) {
				if(jobParameters.getParameters().containsKey("executionId")) {
					Long executionId = Long.valueOf(jobParameters.getString("executionId"));
					JobExecution jobExecution = jobExplorer.getJobExecution(executionId);
					if(jobExecution == null) {
						System.out.println("Não foi encontrada execução com id = " + executionId);
					} else {
						reportController.printExecutionReport(System.out, jobExecution);
						reportController.buildAndExportReport(System.out, jobExecution, null);						
					}
				} else {
					List<JobExecution> jobExecutions = getRunningJobExecutions(jobIdentifier);
					if (jobExecutions == null) {
						System.out.println("Nenhuma execução em andamento para o job " + jobIdentifier);
						List<JobInstance> jobInstances = jobExplorer.getJobInstances(jobIdentifier, 0, 1);
						if(!jobInstances.isEmpty()) {
							List<JobExecution> jobLastExecutions = jobExplorer.getJobExecutions(jobInstances.get(0));
							if(!jobLastExecutions.isEmpty()) {
								System.out.println("Gerando relatório para a última execução do job " + jobIdentifier);
								JobExecution lastJobExecution = jobLastExecutions.get(0);
								reportController.printExecutionReport(System.out, lastJobExecution);
								reportController.buildAndExportReport(System.out, lastJobExecution, null);							
							}
						}
					} else {
						for (JobExecution jobExecution : jobExecutions) {							
							reportController.printExecutionReport(System.out, jobExecution);
							reportController.buildAndExportReport(System.out, jobExecution, null);
						}
					}
				}
				return exitCodeMapper.intValue(ExitStatus.COMPLETED.getExitCode());
			}
			
			if (opts.contains("-stop")) {
				List<JobExecution> jobExecutions = getRunningJobExecutions(jobIdentifier);
				if (jobExecutions == null) {
					throw new JobExecutionNotRunningException("Nenhuma execução em andamento para o job " + jobIdentifier);
				}
				for (JobExecution jobExecution : jobExecutions) {
					jobExecution.setStatus(BatchStatus.STOPPING);
					jobRepository.update(jobExecution);
				}
				return exitCodeMapper.intValue(ExitStatus.COMPLETED.getExitCode());
			}

			if (opts.contains("-abandon")) {
				List<JobExecution> jobExecutions = getStoppedJobExecutions(jobIdentifier);
				if (jobExecutions == null) {
					throw new JobExecutionNotStoppedException("Nenhuma execução com status stopped foi encontrada para o job " + jobIdentifier);
				}
				for (JobExecution jobExecution : jobExecutions) {
					jobExecution.setStatus(BatchStatus.ABANDONED);
					jobRepository.update(jobExecution);
				}
				return exitCodeMapper.intValue(ExitStatus.COMPLETED.getExitCode());
			}

			if (opts.contains("-restart")) {
				JobExecution jobExecution = getLastFailedJobExecution(jobIdentifier);
				if (jobExecution == null) {
					throw new JobExecutionNotFailedException("Nenhuma execução com status failed ou stopped foi encontrada para o job "
							+ jobIdentifier);
				}
				jobParameters = jobExecution.getJobParameters();
				jobName = jobExecution.getJobInstance().getJobName();
			}

			Job job;
			if (jobLocator != null) {
				job = jobLocator.getJob(jobName);
			}
			else {
				job = (Job) context.getBean(jobName);
			}

			if (opts.contains("-next")) {
				JobParameters nextParameters = getNextJobParameters(job);
				Map<String, JobParameter> map = new HashMap<String, JobParameter>(nextParameters.getParameters());
				map.putAll(jobParameters.getParameters());
				jobParameters = new JobParameters(map);
			}

			JobExecution jobExecution = launcher.run(job, jobParameters);
			if(!InfraJobContext.getInstance().isIgnorePDFReport()) {
				reportController.buildAndExportReport(System.out, jobExecution, null);
			}
			reportController.printExitReport(System.out, jobExecution);			
			return getExitCode(jobExecution);

		}
		catch (Throwable e) {
			String message = "Finalizou com erros: " + e.getMessage();
			System.out.println(message);			
			logger.error(message, e);
			InfraJobRunner.message = message;
			return exitCodeMapper.intValue(ExitStatus.FAILED.getExitCode());
		}
		
	}
	
	private static void configureSpringProfiles(boolean slave) {
		String configuredProfiles = System.getProperty(SystemPropertyKeys.SPRING_PROFILES_ACTIVE);
		StringBuilder newProfiles = new StringBuilder();
		if(StringUtils.hasText(configuredProfiles)) {
			newProfiles.append(configuredProfiles + ",");						
		}
		newProfiles.append("slave");
		if(!slave) {
			newProfiles.append(",master");			
		} 
		
		System.setProperty(SystemPropertyKeys.SPRING_PROFILES_ACTIVE, newProfiles.toString());
	}
	
	private static void printCommandLineSample(PrintStream printStream) {
		printStream.println(MessageFormat.format("exemplo: java -D{0}=/opt/infra-batch -jar xxx-batch-executable.jar \"jobPath.xml\" \"jobIdentifier\" paramX=z", SystemPropertyKeys.CONFIG_DIRECTORY));
	}

	/**
	 * Método inicial executado a partir da linha de comando.
	 * @param args
	 * - O primeiro parametro deve ser o xml de definição do Job e contexto do Spring
	 * - O segundo parâmetro deve ser o id do Job a ser executado
	 * - Os demais parâmetros são repassados para o CommandLineJobRunner 
	 */
	public static void main(String[] args) throws Exception {
		
		System.out.println("Iniciando processamento...");		
		
		String configDir = System.getProperty(SystemPropertyKeys.CONFIG_DIRECTORY);
		if(configDir == null || configDir.trim().length() == 0) {
			System.out.println(MessageFormat.format("A propriedade de sistema {0} deve ser configurada.", SystemPropertyKeys.CONFIG_DIRECTORY));
			printCommandLineSample(System.err);
			systemExiter.exit(3);			
		}
		
		List<String> newargs = new ArrayList<String>(Arrays.asList(args));
		
		Set<String> opts = new HashSet<String>();
		List<String> params = new ArrayList<String>();					

		String jobPath = null;
		String jobIdentifier = null;
		int count = 0;
		
		for (int i = 0; i < newargs.size(); i++) {
			String arg = newargs.get(i);
			if (VALID_OPTS.contains(arg)) {
				opts.add(arg);
			} else {
				switch (count) {
				case 0:
					jobPath = arg;
					break;
				case 1:
					jobIdentifier = arg;
					break;
				default:
					params.add(arg);
					break;
				}
				count++;
			}
		}
		
		if (jobPath == null || jobIdentifier == null) {
			System.out.println("Informe o jobPath e o jobIdentifier");
			printCommandLineSample(System.out);
			systemExiter.exit(3);
		}				
		
		InfraJobContext.getInstance().configureJobContext(jobIdentifier, opts);
		
		boolean slave = InfraJobContext.getInstance().isSlave();
		
		configureSpringProfiles(slave);		
		
		InfraJobRunner command = new InfraJobRunner(jobPath);
		try {
				
			if(slave) {
				System.out.println(MessageFormat.format("Iniciando máquina escrava para o processamento de {0}...", jobPath));								
				System.in.read();
			} else {
				try {
					String[] parameters = params.toArray(new String[params.size()]);
					int result = command.start(jobIdentifier, parameters, opts);
					command.exit(result);
				} catch(Exception e) {
					e.printStackTrace();
					systemExiter.exit(8); 
				}
			}
		} finally {
			if(command.getContext() != null) {
				command.getContext().close();
			}
		}
		
	}
	
}
