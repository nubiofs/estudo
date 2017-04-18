package br.gov.serpro.supde.infra.batch.core.transaction;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.support.DefaultTransactionStatus;

import br.gov.serpro.supde.infra.batch.core.constant.MessageKeys;
import br.gov.serpro.supde.infra.batch.core.context.InfraJobContext;

/**
 * TransactionManager padrão para o Job.
 * 
 * Criado apenas para adicionar a funcionalidade do simulationMode.
 * 
 * @see DataSourceTransactionManager
 * 
 * @author 05601970475
 *
 */
public class InfraDataSourceTransactionManager extends DataSourceTransactionManager {

	private static Logger logger = LoggerFactory.getLogger(InfraDataSourceTransactionManager.class);
	
	private static final long serialVersionUID = 1L;
	
	@Autowired
	private MessageSource messageSource;
		
	public InfraDataSourceTransactionManager() {
		super();
	}
	
	public InfraDataSourceTransactionManager(DataSource dataSource) {
		super(dataSource);
	}

	@Override
	protected void doCommit(DefaultTransactionStatus status) {
		if(InfraJobContext.getInstance().isSimulationMode()) {
			logger.warn("Thread #" + Thread.currentThread().getId() + " -> " + messageSource.getMessage(MessageKeys.SIMULATION_MODE_ENABLED, null, null));
			super.doRollback(status);
		} else {
			logger.debug("Thread #" + Thread.currentThread().getId() + " -> " + messageSource.getMessage(MessageKeys.SIMULATION_MODE_DISABLED, null, null));
			super.doCommit(status);			
		}
	}
	
}
