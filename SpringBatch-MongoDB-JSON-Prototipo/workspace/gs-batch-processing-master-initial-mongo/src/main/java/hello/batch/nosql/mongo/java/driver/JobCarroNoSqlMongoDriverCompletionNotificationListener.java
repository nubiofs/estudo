package hello.batch.nosql.mongo.java.driver;

import hello.batch.nosql.mongo.constantes.MongoDataAcessConstants;
import hello.pojo.Carro;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.stereotype.Component;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;

@Component
public class JobCarroNoSqlMongoDriverCompletionNotificationListener extends JobExecutionListenerSupport {

	private static final Logger log = LoggerFactory.getLogger(JobCarroNoSqlMongoDriverCompletionNotificationListener.class);

	/** Unit under test. */
	protected MongoDBItemReader reader;
	
	@Override
	public void beforeJob(JobExecution jobExecution) {
		
		// uses Mongo Java Driver to inspect the results.
		reader = new MongoDBItemReader();
		reader.setMongo(new MongoClient(MongoDataAcessConstants.HOST, MongoDataAcessConstants.PORT));
		reader.setDb(MongoDataAcessConstants.DB_NAME);
		reader.setCollection(MongoDataAcessConstants.COLLECTION_NAME);

		//log.info("MongoDBItemReader: " + reader);

	}

	@Override
	public void afterJob(JobExecution jobExecution) {

		//This code listens for when a job is BatchStatus.COMPLETED
		if(jobExecution.getStatus() == BatchStatus.COMPLETED) {

			log.info("!!! JOB FINISHED! Time to verify the results");

			try {

				reader.doOpen();

				for (BasicDBObject car : readAll()) {
				
					Carro c = reader.convert(car);
					log.info("Found Carro <" + c.getKm() + ", " + c.getNome() + "> in the database.");
					
				}

				reader.doClose();
				
			} catch (Exception e) {
				log.info("Exception: " + e.getMessage());
				reader.getCursor().close();
			}
			
		}

	}

	private List<BasicDBObject> readAll() throws Exception {
		
		List<BasicDBObject> docs = new ArrayList<BasicDBObject>();

		BasicDBObject doc = (BasicDBObject) reader.doRead();
		while (doc != null){
			docs.add(doc);
			doc = (BasicDBObject) reader.doRead();
		}
		
		return docs;
		
	}	

}