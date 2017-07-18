package hello.batch.nosql.spring.data.mongo;

import hello.pojo.Carro;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Component;

@Component
public class JobCarroNoSqlSpringDataMongoDBCompletionNotificationListener extends JobExecutionListenerSupport {

	private static final Logger log = LoggerFactory.getLogger(JobCarroNoSqlSpringDataMongoDBCompletionNotificationListener.class);

	@Autowired
	private CarroRepository repository;
	
	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("findByNomeOrderByKm: " + repository.findByNomeOrderByKm("CORSA"));
		log.info("findByNomeOrderByKmDesc: " + repository.findByNomeOrderByKmDesc("CORSA"));
		log.info("countByKm: " + repository.countByKm("10"));
		log.info("findCarro: " + findCarro(new Carro("10", "corsa")));
	}

	public List<Carro> findCarro(Carro c) {
	    return repository.findAll(Example.of(c));
	}
	
	@Override
	public void afterJob(JobExecution jobExecution) {

		//This code listens for when a job is BatchStatus.COMPLETED
		if(jobExecution.getStatus() == BatchStatus.COMPLETED) {

			log.info("!!! JOB FINISHED! Time to verify the results");

			for(Carro c : repository.findAll()){
				log.info("Found Carro <" + c.getKm() + ", " + c.getNome() + "> in the database.");
			}
			
//			Page<Person> persons = repository.findAll(new PageRequest(0, 10));
			
		}

	}

}