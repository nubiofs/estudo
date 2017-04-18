package br.gov.serpro.supde.infra.batch.core.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.SkipListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;

import br.gov.serpro.supde.infra.batch.core.constant.MessageKeys;

/**
 * Listener genérico para loggar 'skip' dos items.
 * 
 * @author 05601970475
 *
 */
public class ItemSkipLoggerListener implements SkipListener {

	private static Logger logger = LoggerFactory.getLogger(ItemSkipLoggerListener.class);
	
	@Autowired
	private MessageSource messageSource;
	
	@Override
	public void onSkipInRead(Throwable t) {
		logger.warn(messageSource.getMessage(MessageKeys.ITEM_SKIP_READ, null, null), t);
	}

	@Override
	public void onSkipInWrite(Object item, Throwable t) {
		logger.warn(messageSource.getMessage(MessageKeys.ITEM_SKIP_WRITE, new Object[] { item.toString() }, null), t);
	}

	@Override
	public void onSkipInProcess(Object item, Throwable t) {
		logger.warn(messageSource.getMessage(MessageKeys.ITEM_SKIP_PROCESS, new Object[] { item.toString() }, null), t);
	}

}
