package br.gov.serpro.supde.infra.batch.core.concurrent;

import java.util.HashMap;
import java.util.Map;

import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.Assert;

public class JdbcColumnRangePartitioner implements Partitioner, InitializingBean {

	private String table;

	private String column;
		
	private JdbcTemplate jdbcTemplate;

	public Map<String, ExecutionContext> partition(int gridSize) {
		Long min = jdbcTemplate.queryForObject("SELECT MIN(" + column + ") from " + table, Long.class);
		Long max = jdbcTemplate.queryForObject("SELECT MAX(" + column + ") from " + table, Long.class);
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
			value.putLong("minValue", start);
			value.putLong("maxValue", end);
			start += targetSize;
			end += targetSize;
			number++;
		}

		return result;
	}

	public void setTable(String table) {
		this.table = table;
	}

	public void setColumn(String column) {
		this.column = column;
	}
	
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(table);
		Assert.notNull(column);
		Assert.notNull(jdbcTemplate);
	}
}
