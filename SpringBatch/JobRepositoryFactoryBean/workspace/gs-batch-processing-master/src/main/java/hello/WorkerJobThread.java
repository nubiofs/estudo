package hello;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;

public class WorkerJobThread implements Runnable {

	private JobParameters parametros;
	private JobRepository jobRepository;
	private JobLauncher jobLauncher;
	private Job job;

	public WorkerJobThread(JobRepository jobRepository, JobLauncher jobLauncher, Job job, JobParameters parametros) {
		this.jobRepository = jobRepository;
		this.jobLauncher = jobLauncher;
		this.job = job;
		this.parametros = parametros;
	}

	@Override
	public void run() {
		
    	if(!isJobInstanceExists()) {

    		System.out.println("\n\n[" + Thread.currentThread().getName() + "] Start Job with (parameters = " + this.parametros.toString() + ").\n");
    		
    		try {
    			
    			Thread.sleep(500);
    			
    			Long jobId = processJob();
    			
    			System.out.println("\n[" + Thread.currentThread().getName() + "] End Job (jodInstanceId = " + jobId + ").\n\n");
    			
    		} catch (Exception e) {
    			System.out.println("[" + Thread.currentThread().getName() + "] [Error: " + e.getMessage() + "]");
    			Thread.currentThread().interrupt();
    		}

    	} else {
    		System.out.println("[" + Thread.currentThread().getName() + "] [Error]: JobInstanceExists!");
    	}

	}
	
	private synchronized boolean isJobInstanceExists() {
		return this.jobRepository.isJobInstanceExists(this.job.getName(), this.parametros);
	}
	
	private Long processJob() throws Exception {
		
		JobExecution jobExec = this.jobLauncher.run(this.job, this.parametros);
		
    	//
    	//Verificando execução final do job
    	//
		ExitStatus exitStatus = jobExec.getExitStatus();
		while (exitStatus.isRunning()) {
			System.out.println("[" + Thread.currentThread().getName() +"] [job isRunning ... (jobId = " + jobExec.getJobId() + ")]");
			Thread.sleep(500);
			exitStatus = jobExec.getExitStatus();
		}
		
		if (ExitStatus.COMPLETED.equals(exitStatus)) {
			System.out.println("[" + Thread.currentThread().getName() + "] [jobLauncher.run OK = " + jobExec.toString() + "]");
		}
		
		return jobExec.getJobId();
		
	}

}
