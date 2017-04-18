package br.gov.serpro.supde.infra.batch.core.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.listener.ItemListenerSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;

import br.gov.serpro.supde.infra.batch.core.constant.MessageKeys;

/**
 * Listener genérico para loggar erros de leitura ou escrita dos items.
 * 
 * @author 05601970475
 *
 */
public class ItemFailureLoggerListener extends ItemListenerSupport {

	private static Logger logger = LoggerFactory.getLogger(ItemFailureLoggerListener.class);	
	
	@Autowired
	private MessageSource messageSource;

	public void onReadError(Exception ex) {
		logger.error(messageSource.getMessage(MessageKeys.ITEM_READ_ERROR, new Object[] { ex.getMessage() }, null), ex);
	}

	public void onWriteError(Exception ex, Object item) {
		logger.error(messageSource.getMessage(MessageKeys.ITEM_WRITE_ERROR, new Object[] { item, ex.getMessage() }, null), ex);
	}

}
