package br.gov.serpro.supde.infra.batch.core.concurrent;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.util.Assert;

public class JdbcRowNumRangePartitioner implements Partitioner, InitializingBean {

	public static final String START_CONTEXT_KEY = "minValue";
	public static final String END_CONTEXT_KEY = "maxValue";
	
	private String sql;
		
	private JdbcTemplate jdbcTemplate;
	
	private PreparedStatementSetter preparedStatementSetter;

	public Map<String, ExecutionContext> partition(int gridSize) {
		Long min = 1l;		
		Long max = jdbcTemplate.query("SELECT count(*) from (" + sql + ")", preparedStatementSetter, 
				new ResultSetExtractor<Long>() {
					@Override
					public Long extractData(ResultSet rs) throws SQLException, DataAccessException {
						rs.next();
						return rs.getLong(1);
					}					
				});
		
		Long targetSize = (max - min) / gridSize + 1;

		Map<String, ExecutionContext> result = new HashMap<String, ExecutionContext>();
		Long number = 0l;
		Long start = min;
		Long end = start + targetSize - 1;

		while (start <= max) {
			ExecutionContext value = new ExecutionContext();
			result.put("partition" + number, value);

			if (end >= max) {
				end = max;
			}
			value.putLong(START_CONTEXT_KEY, start);
			value.putLong(END_CONTEXT_KEY, end);
			start += targetSize;
			end += targetSize;
			number++;
		}

		return result;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;		
	}
	
	public void setPreparedStatementSetter(PreparedStatementSetter preparedStatementSetter) {
		this.preparedStatementSetter = preparedStatementSetter;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(sql);
		Assert.notNull(jdbcTemplate);
	}
}
