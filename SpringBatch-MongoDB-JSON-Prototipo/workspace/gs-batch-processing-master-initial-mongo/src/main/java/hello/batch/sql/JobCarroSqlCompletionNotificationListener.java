package hello.batch.sql;

import hello.pojo.Carro;

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
public class JobCarroSqlCompletionNotificationListener extends JobExecutionListenerSupport {

	private static final Logger log = LoggerFactory.getLogger(JobCarroSqlCompletionNotificationListener.class);

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public JobCarroSqlCompletionNotificationListener(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		
		//This code listens for when a job is BatchStatus.COMPLETED
		if(jobExecution.getStatus() == BatchStatus.COMPLETED) {
			
			log.info("!!! JOB FINISHED! Time to verify the results");

			// uses JdbcTemplate to inspect the results.
			List<Carro> results = jdbcTemplate.query("SELECT km, nome FROM carro", new RowMapper<Carro>() {
				@Override
				public Carro mapRow(ResultSet rs, int row) throws SQLException {
					return new Carro(rs.getString(1), rs.getString(2));
				}
			});

			for (Carro car : results) {
				log.info("Found Carro <" + car.getKm() + ", " + car.getNome() + "> in the database.");
			}

		}
		
	}
	
}