package hello.batch.toSql;

import hello.pojo.Person;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class JobPersonCompletionNotificationListener extends JobExecutionListenerSupport {

	private static final Logger log = LoggerFactory.getLogger(JobPersonCompletionNotificationListener.class);

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public JobPersonCompletionNotificationListener(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		
		//This code listens for when a job is BatchStatus.COMPLETED
		if(jobExecution.getStatus() == BatchStatus.COMPLETED) {
			
			log.info("!!! JOB FINISHED! Time to verify the results");

			// uses JdbcTemplate to inspect the results.
			List<Person> results = jdbcTemplate.query("SELECT first_name, last_name FROM people", new RowMapper<Person>() {
				@Override
				public Person mapRow(ResultSet rs, int row) throws SQLException {
					return new Person(rs.getString(1), rs.getString(2));
				}
			});

			for (Person person : results) {
				log.info("Found <" + person + "> in the database.");
			}

		}
		
	}
	
}