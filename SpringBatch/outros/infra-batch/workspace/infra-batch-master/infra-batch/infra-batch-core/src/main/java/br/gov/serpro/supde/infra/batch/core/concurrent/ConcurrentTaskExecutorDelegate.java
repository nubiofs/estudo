package br.gov.serpro.supde.infra.batch.core.concurrent;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.scheduling.concurrent.ConcurrentTaskExecutor;

import br.gov.serpro.supde.infra.batch.core.constant.MessageKeys;
import br.gov.serpro.supde.infra.batch.core.context.InfraJobContext;

/**
 * TaskExecutor configurável através do InfraJobContext.
 * 
 * @author 05601970475
 *
 */
public class ConcurrentTaskExecutorDelegate extends ConcurrentTaskExecutor {
	
	private static Logger logger = LoggerFactory.getLogger(ConcurrentTaskExecutorDelegate.class);
	
	@Autowired
	private MessageSource messageSource;

	public ConcurrentTaskExecutorDelegate() {
		super();
	}

	public ConcurrentTaskExecutorDelegate(Executor concurrentExecutor) {
		super(concurrentExecutor);
	}

	@PostConstruct
	public void loadConfiguration() {
		Executor configurableExecutor = null;		
		int nThreads = InfraJobContext.getInstance().getThreads();
		switch (InfraJobContext.getInstance().getExecutorType()) {
		case FIXED:
			configurableExecutor = Executors.newFixedThreadPool(nThreads);
			logger.info(messageSource.getMessage(MessageKeys.CONFIGURABLE_EXECUTOR, new Object[] { "FixedThreadPool", nThreads }, null));
			break;
		case CACHED:
			configurableExecutor = Executors.newCachedThreadPool();
			logger.info(messageSource.getMessage(MessageKeys.CONFIGURABLE_EXECUTOR, new Object[] { "CachedThreadPool", "?" }, null));
			break;
		case SINGLE:
			configurableExecutor = Executors.newSingleThreadExecutor();
			logger.info(messageSource.getMessage(MessageKeys.CONFIGURABLE_EXECUTOR, new Object[] { "SingleThread", 1 }, null));
			break;
		default:
			String message = messageSource.getMessage(MessageKeys.CONFIGURABLE_EXECUTOR_ERROR, new Object[] {}, null);
			logger.error(message);
			throw new RuntimeException(message);
		}
		
		setConcurrentExecutor(configurableExecutor);
	}
	
}
