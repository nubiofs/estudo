package br.gov.serpro.supde.infra.batch.support;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.SkipListener;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;

import br.gov.serpro.supde.infra.batch.sample.domain.Product;

public class MonitoracaoProduct implements SkipListener<Product, Product>, StepExecutionListener{

	private static Logger logger = LoggerFactory.getLogger(MonitoracaoProduct.class);
	
	public static List<LogRecord> onSkipsInRead = new ArrayList<LogRecord>();
	public static List<LogRecord> onSkipsInProcess = new ArrayList<LogRecord>();
	public static List<LogRecord> onSkipsInWrite = new ArrayList<LogRecord>();
	
	@Override
	public void onSkipInRead(Throwable t) {
		onSkipsInRead.add(new LogRecord(null, t));
	}
	
	@Override
	public void onSkipInProcess(Product item, Throwable t) {
		onSkipsInProcess.add(new LogRecord(item, t));
	}

	@Override
	public void onSkipInWrite(Product item, Throwable t) {
		onSkipsInWrite.add(new LogRecord(item, t));
	}
	
	@Override
	public void beforeStep(StepExecution arg0) {
		// TODO Auto-generated method stub
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		
		List<Throwable> failures = stepExecution.getFailureExceptions();
		for (Throwable ex : failures) {
			ex.printStackTrace();
		}
		
		logger.info("######################################################################");
		logger.info("##################### RELATORIO DA CARGA #############################");
		logger.info("Product lidos com sucesso: " + stepExecution.getReadCount());
		logger.info("Product nao lidas (falha na leitura): " + stepExecution.getReadSkipCount());
		logger.info("Product ignorados durante processamento: " + stepExecution.getProcessSkipCount());
		logger.info("Product gravadas com sucesso: " + stepExecution.getWriteCount());
		logger.info("Product nao gravadas: " + stepExecution.getWriteSkipCount());

		if(onSkipsInRead.size() > 0) {
			logger.info("@@@@@@@@@@@@@@@@@@@@@ LISTA DE Product NAO LIDOS @@@@@@@@@@@@@@@@@@@@@");
			for (LogRecord log : onSkipsInRead) {
				logger.info(log.t.toString());
			}
		}
		
		if(onSkipsInProcess.size() > 0) {
			logger.info("@@@@@@@@@@ LISTA DE Product IGNORADOS DURANTE PROCESSAMENTO @@@@@@@@@@");
			for (LogRecord log : onSkipsInProcess) {
				logger.info("Imovel=[" + log.item + "], causa=[" + log.t.toString() + "]");
			}
		}

		if(onSkipsInWrite.size() > 0) {
			logger.info("@@@@@@@@@@ LISTA DE Product NAO GRAVADOS @@@@@@@@@@");
			for (LogRecord log : onSkipsInWrite) {
				logger.info("Imovel=[" + log.item + "], causa=[" + log.t.toString() + "]");
			}
		}
		
		logger.info("################### FIM RELATORIO DA CARGA ###################");
		logger.info("##############################################################");

		return stepExecution.getExitStatus();
		
	}

	private class LogRecord {
		
		public Product item;
		public Throwable t;

		public LogRecord(Product item, Throwable t) {
			this.item = item;
			this.t = t;
		}
		
	}
	
}
