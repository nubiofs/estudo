package br.gov.serpro.supde.infra.batch.core.support;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.support.SingleItemPeekableItemReader;
import org.springframework.batch.repeat.CompletionPolicy;
import org.springframework.batch.repeat.RepeatContext;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.batch.repeat.context.RepeatContextSupport;

/**
 * Classe para auxiliar a criação de um chunk-completion-policy customizado.
 * - Implementar o método "boolean isChunkCompleted(final T current, final T next)";
 * - Colocar o bean como reader e também como chunk-completion-policy;
 * - Colocar o reader "original" como delegate neste bean.
 * 
 * @author 05601970475
 *
 * @param <T> tipo do Objeto lido no ItemReader
 */
public abstract class AbstractPeekableItemReaderCompletionPolicy<T> extends SingleItemPeekableItemReader<T> implements CompletionPolicy {
	
	private static Logger logger = LoggerFactory.getLogger(AbstractPeekableItemReaderCompletionPolicy.class);
	
	private T current;

	@Override
	public boolean isComplete(RepeatContext context) {
		return ((ReaderRepeatContext) context).isComplete();
	}

	@Override
	public boolean isComplete(RepeatContext context, RepeatStatus result) {
		return ((ReaderRepeatContext) context).isComplete();
	}

	@Override
	public RepeatContext start(RepeatContext parent) {
		//Atribui o primeiro item para comparar com os próximos
		this.current = invokePeek();
		return new ReaderRepeatContext(parent);
	}

	@Override
	public void update(RepeatContext context) {
		if (current == null) {
			context.setCompleteOnly();
		}
	}

	private T invokePeek() {
		T peeked = null;
		try {
			peeked = peek();
		} catch (Exception e) {
			logger.error("Não foi possível ler o item", e);			
		}
		return peeked;
	}
       
	protected class ReaderRepeatContext extends RepeatContextSupport {

		public ReaderRepeatContext(RepeatContext parent) {
			super(parent);
		}

		public boolean isComplete() {
			T next = null;
			next = invokePeek();
			
			if (next == null || isChunkCompleted(current, next)) {
				current = next;
				return true;
			}
			return false;
		}
	}
	
	public abstract boolean isChunkCompleted(final T current, final T next);

}
