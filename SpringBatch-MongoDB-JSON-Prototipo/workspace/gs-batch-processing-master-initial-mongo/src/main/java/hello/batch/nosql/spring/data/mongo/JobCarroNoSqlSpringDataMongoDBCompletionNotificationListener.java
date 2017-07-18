package hello.batch.nosql.spring.data.mongo;

import hello.pojo.Carro;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JobCarroNoSqlSpringDataMongoDBCompletionNotificationListener extends JobExecutionListenerSupport {

	private static final Logger log = LoggerFactory.getLogger(JobCarroNoSqlSpringDataMongoDBCompletionNotificationListener.class);

	@Autowired
	private CarroRepository repository;
	
	@Override
	public void beforeJob(JobExecution jobExecution) {
		
		//log.info("MongoDBItemReader: " + reader);

	}

	@Override
	public void afterJob(JobExecution jobExecution) {

		//This code listens for when a job is BatchStatus.COMPLETED
		if(jobExecution.getStatus() == BatchStatus.COMPLETED) {

			log.info("!!! JOB FINISHED! Time to verify the results");

			for(Carro c : repository.findAll()){
				log.info("Found Carro <" + c.getKm() + ", " + c.getNome() + "> in the database.");
			}
			
		}

	}

}