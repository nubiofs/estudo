package hello;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.NoSuchJobExecutionException;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.batch.BatchAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;

/**
 * https://github.com/eugenp/tutorials/tree/master/spring-boot-autoconfiguration
 * 
 * https://stackoverflow.com/questions/43255169/spring-jpa-at-least-one-jpa-metamodel-must-be-present/43305661
 *
 */
@SpringBootApplication
@ComponentScan
@EnableAutoConfiguration(
		exclude = {DataSourceAutoConfiguration.class, BatchAutoConfiguration.class})
public class Application {

//	@Autowired(required=true)
//	public Job importUserJob;
	
    public static void main(String[] args) throws Exception {
    	
    	//
    	//Inicializando a aplicação
    	//
    	ApplicationContext context = SpringApplication.run(Application.class, args);
    	
    	JobLauncher jobLauncher = context.getBean(JobLauncher.class);
    	//Job importUserJob = context.getBean(Job.class, "importUserJob");
//    	Job importUserJob = context.getBean(Job.class);
    	//Job jobHealthCheck = context.getBean(Job.class, "jobHealthCheck");
    	JobRepository jobRepository = context.getBean(JobRepository.class);
    	JobExplorer jobExplorer = context.getBean(JobExplorer.class);
    	//JobOperator jobOperator = context.getBean(JobOperator.class);
    	
    	
    	context.getBeanNamesForType(Job.class);
    	
    	System.out.println("SpringApplication.run: OK!");


		Long resultado = new Application().runImportUserJob(context, jobLauncher);
		
//    	if(jobRepository.isJobInstanceExists(importUserJob.getName(), parametros)) {
//    		System.out.println("JobInstanceExists: " + importUserJob.toString());
//    	}
    	
    	JobExecution jobExecution = jobExplorer.getJobExecution(resultado);
    	//jobExecution.stop();
		if (jobExecution != null && jobExecution.isStopping()){ 
			 System.out.println("jobExecution.isStopping OK!");
		} else {
			throw new NoSuchJobExecutionException("[Error] JobExecution with id " + jobExecution.getId());
		}
		
		//jobOperator.stop(jobExec.getId());

    	//BeanFactoryUtils.
		
//		resultado = new Application().runJobHealthCheck(context, jobLauncher);
//		
//    	jobExecution = jobExplorer.getJobExecution(resultado);
//    	//jobExecution.stop();
//		if (jobExecution != null && jobExecution.isStopping()){ 
//			 System.out.println("jobExecution.isStopping OK!");
//		} else {
//			throw new NoSuchJobExecutionException("[Error] JobExecution with id " + jobExecution.getId());
//		}
		
    	
    }
    
	public Long runImportUserJob(ApplicationContext context, JobLauncher jobLauncher) throws Exception {
		
		Long retorno = null;
		
		Job importUserJob = context.getBean("importUserJob", Job.class);
		
    	//
    	//Execultado o job
    	//
    	JobParameters parametros = new JobParametersBuilder()
				//Para identificação única na execução de várias instâncias do Job
				.addString("timeRun", String.valueOf(System.currentTimeMillis()))
				.toJobParameters();
    	JobExecution jobExec = jobLauncher.run(importUserJob, parametros);
    	
    	//
    	//Verificando execução final do job
    	//
		ExitStatus exitStatus = jobExec.getExitStatus();
		while (exitStatus.isRunning()) {
			Thread.sleep(500);
			exitStatus = jobExec.getExitStatus();
		}
		
		if (ExitStatus.COMPLETED.equals(exitStatus)) {
			System.out.println("jobLauncher.run: " + jobExec.toString());
			retorno = jobExec.getJobId();
		}
		
		return retorno;
		
	}
	
	public Long runJobHealthCheck(ApplicationContext context, JobLauncher jobLauncher) throws Exception {
		
		Long retorno = null;
		
		Job jobHealthCheck = context.getBean("jobHealthCheck",  Job.class);
		
    	//
    	//Execultado o job
    	//
    	JobParameters parametros = new JobParametersBuilder()
				//Para identificação única na execução de várias instâncias do Job
				.addString("timeRun", String.valueOf(System.currentTimeMillis()))
				.toJobParameters();
    	JobExecution jobExec = jobLauncher.run(jobHealthCheck, parametros);
    	
    	//
    	//Verificando execução final do job
    	//
		ExitStatus exitStatus = jobExec.getExitStatus();
		while (exitStatus.isRunning()) {
			Thread.sleep(500);
			exitStatus = jobExec.getExitStatus();
		}
		
		if (ExitStatus.COMPLETED.equals(exitStatus)) {
			System.out.println("jobLauncher.run: " + jobExec.toString());
			retorno = jobExec.getJobId();
		}

		
		
		return retorno;
		
		
			
	}
    
}
