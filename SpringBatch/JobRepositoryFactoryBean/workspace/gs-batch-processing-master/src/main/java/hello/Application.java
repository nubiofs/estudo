package hello;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.JobOperator;
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
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, BatchAutoConfiguration.class})
public class Application {

    public static void main(String[] args) throws Exception {
    	
    	//
    	//Inicializando a aplicação
    	//
    	ApplicationContext context = SpringApplication.run(Application.class, args);
    	
    	JobLauncher jobLauncher = context.getBean(JobLauncher.class);
    	Job importUserJob = context.getBean("importUserJob", Job.class);
    	Job jobTaskletLoop = context.getBean("jobTaskletLoop", Job.class);
    	JobRepository jobRepository = context.getBean(JobRepository.class);
    	//JobExplorer jobExplorer = context.getBean(JobExplorer.class);
    	//teste+
    	//JobOperator jobOperator = context.getBean(JobOperator.class);
    	//teste-
    	
    	System.out.println("SpringApplication.run...config OK!");

    	int numThreads = 10;
    	ExecutorService executor = Executors.newFixedThreadPool(numThreads);
    	
    	JobParameters parametrosImportUserJob = new JobParametersBuilder()
				//Para identificação única na execução de várias instâncias do Job
				.addString("timeRun", String.valueOf(System.currentTimeMillis()))
				.toJobParameters();
    	
    	JobParameters parametrosJobTaskletLoop = new JobParametersBuilder()
				//Para identificação única na execução de várias instâncias do Job
    			.addString("timeRun", String.valueOf(System.currentTimeMillis()))
    			//.addLong("numLoops", 8000000L)
    			//.addLong("numLoops", 100000L)
				.addString("numLoops", "10000")
				//.addLong("numLoops", 30000L)
				.toJobParameters();
    	
		for (int i = 0; i < numThreads; i++) {
    	//for (int i = 0; i < (numThreads + 10); i++) {
    	//for (int i = 0; i < (numThreads - 2); i++) {
    		
    		//importUserJob
			Runnable worker = new WorkerJobThread(jobRepository, jobLauncher, importUserJob, parametrosImportUserJob);
			executor.execute(worker);
			
			//Thread.sleep(500);
			
			//jobTaskletLoop
			Runnable worker2 = new WorkerJobThread(jobRepository, jobLauncher, jobTaskletLoop, parametrosJobTaskletLoop);
			executor.execute(worker2);
			
			Thread.sleep(500);
			
		}
    	
    	//teste+
		//jobTaskletLoop
//    	parametrosJobTaskletLoop = new JobParametersBuilder()
//				//Para identificação única na execução de várias instâncias do Job
//				.addLong("numLoops", 30000L)
//				.toJobParameters();
//    	Runnable worker = new WorkerJobThread(jobRepository, jobLauncher, jobTaskletLoop, parametrosJobTaskletLoop);
//		executor.execute(worker);
//		jobOperator.stop(1l);
    	//teste-
    	
		executor.shutdown();
		while (!executor.isTerminated()) {
			System.out.println("[" + Thread.currentThread().getName() + "] WorkerJobThread is running...");
			Thread.sleep(1000);
		}
		System.out.println("[" + Thread.currentThread().getName() + "] [Finished all threads]!");
    	
    	/*
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
		}

    	if(jobRepository.isJobInstanceExists(importUserJob.getName(), parametros)) {
    		System.out.println("JobInstanceExists: " + importUserJob.toString());
    	}
    	
    	JobExecution jobExecution = jobExplorer.getJobExecution(jobExec.getId());
		if (jobExecution != null){ 
			 System.out.println("jobExplorer.getJobExecution OK!");
		} else {
			throw new NoSuchJobExecutionException("[Error] JobExecution with id " + jobExecution.getId());
		}
		*/

    	//BeanFactoryUtils.
		
		///////////
		/*
		
		parametros = new JobParametersBuilder()
				//Para identificação única na execução de várias instâncias do Job
				.addString("timeRun", String.valueOf(System.currentTimeMillis()))
				.toJobParameters();
    	jobExec = jobLauncher.run(jobTaskletLoop, parametros);
    	
    	//
    	//Verificando execução final do job
    	//
		exitStatus = jobExec.getExitStatus();
		while (exitStatus.isRunning()) {
			Thread.sleep(500);
			exitStatus = jobExec.getExitStatus();
		}
		
		if (ExitStatus.COMPLETED.equals(exitStatus)) {
			System.out.println("jobLauncher.run: " + jobExec.toString());
		}

    	if(jobRepository.isJobInstanceExists(importUserJob.getName(), parametros)) {
    		System.out.println("JobInstanceExists: " + importUserJob.toString());
    	}
    	
    	jobExecution = jobExplorer.getJobExecution(jobExec.getId());
		if (jobExecution != null){ 
			 System.out.println("jobExplorer.getJobExecution OK!");
		} else {
			throw new NoSuchJobExecutionException("[Error] JobExecution with id " + jobExecution.getId());
		}
		*/
    	
    }
    
}
