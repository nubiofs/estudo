package br.gov.serpro.supde.infra.batch.support;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.SkipListener;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;

import br.gov.serpro.supde.infra.batch.sample.domain.Experience;

public class MonitoracaoExperience implements SkipListener<Experience, Experience>, StepExecutionListener{

	private static Logger logger = LoggerFactory.getLogger(MonitoracaoExperience.class);
	
	public static List<LogRecord> experienceNaoLidas = new ArrayList<LogRecord>();
	public static List<LogRecord> experienceNaoGravadas = new ArrayList<LogRecord>();
	
	@Override
	public void onSkipInRead(Throwable t) {
		experienceNaoLidas.add(new LogRecord(null, t));
	}
	
	@Override
	public void onSkipInProcess(Experience arg0, Throwable arg1) {
		// TODO Auto-generated method stub
	}

	@Override
	public void onSkipInWrite(Experience item, Throwable t) {
		experienceNaoGravadas.add(new LogRecord(item, t));
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
		logger.info("Experience lidas com sucesso: " + stepExecution.getReadCount());
		logger.info("Experience nao lidas (falha na leitura): " + stepExecution.getReadSkipCount());
		//logger.info("Experience ignoradas durante processamento: " + stepExecution.getProcessSkipCount());
		logger.info("Experience gravadas com sucesso: " + stepExecution.getWriteCount());
		logger.info("Experience nao gravadas: " + stepExecution.getWriteSkipCount());

		if(experienceNaoLidas.size() > 0) {
			logger.info("@@@@@@@@@@@@@@@@@@@@@ LISTA DE Experience NAO LIDAS @@@@@@@@@@@@@@@@@@@@@");
			for (LogRecord log : experienceNaoLidas) {
				logger.info(log.t.toString());
			}
		}
		
//		if(imoveisIgnorados.size() > 0) {
//			logger.info("@@@@@@@@@@ LISTA DE IMOVEIS IGNORADOS DURANTE PROCESSAMENTO @@@@@@@@@@");
//			for (LogRecord log : imoveisIgnorados) {
//				logger.info("Imovel=[" + log.item + "], causa=[" + log.t.toString() + "]");
//			}
//		}

		if(experienceNaoGravadas.size() > 0) {
			logger.info("@@@@@@@@@@ LISTA DE Experience NAO GRAVADAS @@@@@@@@@@");
			for (LogRecord log : experienceNaoGravadas) {
				logger.info("Imovel=[" + log.item + "], causa=[" + log.t.toString() + "]");
			}
		}
		
		logger.info("################### FIM RELATORIO DA CARGA ###################");
		logger.info("##############################################################");

		return stepExecution.getExitStatus();
		
	}

	private class LogRecord {
		public Experience item;
		public Throwable t;

		public LogRecord(Experience item, Throwable t) {
			this.item = item;
			this.t = t;
		}
	}
	
}
