package br.gov.serpro.supde.infra.batch.core.concurrent;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;

public class BlockingQueueReader<T> implements ItemReader<T>, InitializingBean  {
	
	private static Logger logger = LoggerFactory.getLogger(BlockingQueueReader.class);
	
	private BlockingQueue<T> queue;
	
	private int timeout;

	@Override
	public T read() throws Exception, UnexpectedInputException, ParseException,
			NonTransientResourceException {		
		T object = queue.poll(timeout, TimeUnit.MILLISECONDS);
		if(object != null) {
			logger.debug("Thread #" + Thread.currentThread().getId() + " - Reading: " + object);
		} else {
			logger.debug("Thread #" + Thread.currentThread().getId() + " - Reader Finished!");
		}
		return object;
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
