package br.gov.serpro.supde.infra.batch.core.concurrent;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.core.resource.ListPreparedStatementSetter;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.Assert;

/**
 * Classe para facilitar o uso do JdbcRowNumRangePartitioner.
 * 
 * @author 05601970475
 *
 */
public class JdbcItemReaderPartitioner<T> extends JdbcCursorItemReader<T> implements StepExecutionListener, Partitioner, InitializingBean {

	private String baseSql;

	private String orderBy;
	
	private List<Object> parameters;
	
	private JdbcRowNumRangePartitioner partitioner;
	
	public String getBaseSql() {
		return baseSql;
	}

	public void setBaseSql(String baseSql) {
		this.baseSql = baseSql;
	}

	public String getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}

	public List<Object> getParameters() {
		return parameters;
	}

	public void setParameters(List<Object> parameters) {
		this.parameters = parameters;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(baseSql);				
		
		if(this.orderBy == null) {
			this.orderBy = "ORDER BY 1";
		}
		
		StringBuilder sb = new StringBuilder("SELECT tmp.* FROM (");
		baseSql = baseSql.replace("\r", " ").replace("\t", " ").replace("\n", " ").trim();		
		//adicionar o rownum ao baseSQL
		int fromIndex = baseSql.toUpperCase().indexOf(" FROM ");
		sb.append(this.baseSql.substring(0, fromIndex));
		sb.append(", ROWNUM AS ID_PAGINATION ");
		sb.append(this.baseSql.substring(fromIndex));
		sb.append(" ");
		sb.append(this.orderBy);
		sb.append(") tmp ");
		sb.append("WHERE ID_PAGINATION >= ? AND ID_PAGINATION <= ?");
		setSql(sb.toString());
		
		//configura o partitioner
		partitioner = new JdbcRowNumRangePartitioner();
		partitioner.setSql(getBaseSql());
		partitioner.setJdbcTemplate(new JdbcTemplate(getDataSource()));
		
		if(parameters != null) {
			ListPreparedStatementSetter preparedStatementSetter = new ListPreparedStatementSetter();
			preparedStatementSetter.setParameters(getParameters());
			partitioner.setPreparedStatementSetter(preparedStatementSetter);
		}

		super.afterPropertiesSet();
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		if(parameters == null) {
			parameters = new ArrayList<Object>();
		}
		
		parameters.add(stepExecution.getExecutionContext().getLong(JdbcRowNumRangePartitioner.START_CONTEXT_KEY));
		parameters.add(stepExecution.getExecutionContext().getLong(JdbcRowNumRangePartitioner.END_CONTEXT_KEY));
		
		ListPreparedStatementSetter preparedStatementSetter = new ListPreparedStatementSetter();
		preparedStatementSetter.setParameters(parameters);
		super.setPreparedStatementSetter(preparedStatementSetter);		
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return null;
	}

	@Override
	public Map<String, ExecutionContext> partition(int gridSize) {
		return partitioner.partition(gridSize);
	}

}
