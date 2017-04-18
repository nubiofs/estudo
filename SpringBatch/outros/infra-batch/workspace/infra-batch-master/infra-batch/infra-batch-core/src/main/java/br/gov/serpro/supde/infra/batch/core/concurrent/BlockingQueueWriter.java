package br.gov.serpro.supde.infra.batch.core.concurrent;

import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;

public class BlockingQueueWriter<T> implements ItemWriter<T>, InitializingBean {
	
	private static Logger logger = LoggerFactory.getLogger(BlockingQueueWriter.class);

	private BlockingQueue<T> queue;
	
	private int timeout;
	
	@Override
	public void write(List<? extends T> items) throws Exception {
		for(T item : items) {
			logger.debug("Thread #" + Thread.currentThread().getId() + " - Writing: " + item);			
			queue.offer(item, timeout, TimeUnit.MILLISECONDS);
		}
	}

	public void setQueue(BlockingQueue<T> queue) {
		this.queue = queue;
	}

	public void setTimeout(int timeout) {
		this.timeout = timeout;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(queue);
		Assert.notNull(timeout);
	}
	
}
