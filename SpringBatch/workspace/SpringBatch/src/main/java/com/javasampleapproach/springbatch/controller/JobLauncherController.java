package com.javasampleapproach.springbatch.controller;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
@RestController
public class JobLauncherController {
 
    @Autowired
    JobLauncher jobLauncher;
 
    @Autowired
    Job job;
 
    /**
     * Create a simple controller JobLauncherController with 1 @RequestMapping(“/launchjob”)
	 * org.springframework.batch.core.launch.JobLauncher: Simple interface for controlling jobs, 
	 * including possible ad-hoc executions, based on different runtime identifiers.
     * @return
     * @throws Exception
     */
    @RequestMapping("/launchjob")
    public String handle() throws Exception {
 
        Logger logger = LoggerFactory.getLogger(this.getClass());
        try {
        	//JobParameters: Value object representing runtime parameters to a batch job.
            JobParameters jobParameters = new JobParametersBuilder().addLong("time", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(job, jobParameters);
        } catch (Exception e) {
            logger.info(e.getMessage());
        }
 
        return "Done";
    }
    
}