package br.gov.serpro.supde.infra.batch.core.concurrent;

import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemStream;
import org.springframework.batch.item.ItemStreamException;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;

public class SynchronizedItemReader<T> implements ItemReader<T>, ItemStream {

	private ItemReader<T> delegate;

	public ItemReader<T> getDelegate() {
		return delegate;
	}

	public void setDelegate(ItemReader<T> delegate) {
		this.delegate = delegate;
	}

	@Override
	public void open(ExecutionContext executionContext) throws ItemStreamException {
		if (this.delegate instanceof ItemStream) {
			((ItemStream) this.delegate).open(executionContext);
		}
	}

	@Override
	public void update(ExecutionContext executionContext) throws ItemStreamException {
		if (this.delegate instanceof ItemStream) {
			((ItemStream) this.delegate).update(executionContext);
		}
	}

	@Override
	public void close() throws ItemStreamException {
		if (this.delegate instanceof ItemStream) {
			((ItemStream) this.delegate).close();
		}
	}

	@Override
	public synchronized T read() throws Exception, UnexpectedInputException, ParseException,
			NonTransientResourceException {
		return delegate.read();
	}

}
