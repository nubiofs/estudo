package hello.batch.nosql.spring.data.mongo;

import hello.pojo.Carro;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.SkipListener;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.stereotype.Component;

@Component
public class StepCarroNoSqlSpringDataMongoDBCompletionNotificationListener implements SkipListener<Carro, Carro>, StepExecutionListener {

	private static final Logger log = LoggerFactory.getLogger(StepCarroNoSqlSpringDataMongoDBCompletionNotificationListener.class);

	private class LogRecord {
		
		public Carro item;
		public Throwable t;

		public LogRecord(Carro item, Throwable t) {
			this.item = item;
			this.t = t;
		}
		
	}

	public static List<LogRecord> onSkipsInRead = new ArrayList<LogRecord>();
	public static List<LogRecord> onSkipsInProcess = new ArrayList<LogRecord>();
	public static List<LogRecord> onSkipsInWrite = new ArrayList<LogRecord>();

	@Override
	public void onSkipInRead(Throwable t) {
		onSkipsInRead.add(new LogRecord(null, t));
	}
	
	@Override
	public void onSkipInProcess(Carro item, Throwable t) {
		onSkipsInProcess.add(new LogRecord(item, t));
	}

	@Override
	public void onSkipInWrite(Carro item, Throwable t) {
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
		
		log.info("######################################################################");
		log.info("##################### RELATORIO DA CARGA #############################");
		log.info("Itens lidos com sucesso: " + stepExecution.getReadCount());
		log.info("Itens nao lidos (falha na leitura): " + stepExecution.getReadSkipCount());
		log.info("Itens ignorados durante processamento: " + stepExecution.getProcessSkipCount());
		log.info("Itens gravados com sucesso: " + stepExecution.getWriteCount());
		log.info("Itens nao gravados: " + stepExecution.getWriteSkipCount());

		if(onSkipsInRead.size() > 0) {
			log.info("@@@@@@@@@@@@@@@@@@@@@ LISTA DE Itens NAO LIDOS @@@@@@@@@@@@@@@@@@@@@");
			for (LogRecord l : onSkipsInRead) {
				log.info(l.t.toString());
			}
		}
		
		if(onSkipsInProcess.size() > 0) {
			log.info("@@@@@@@@@@ LISTA DE Itens IGNORADOS DURANTE PROCESSAMENTO @@@@@@@@@@");
			for (LogRecord l : onSkipsInProcess) {
				log.info("Imovel=[" + l.item + "], causa=[" + l.t.toString() + "]");
			}
		}

		if(onSkipsInWrite.size() > 0) {
			log.info("@@@@@@@@@@ LISTA DE Itens NAO GRAVADOS @@@@@@@@@@");
			for (LogRecord l : onSkipsInWrite) {
				log.info("Imovel=[" + l.item + "], causa=[" + l.t.toString() + "]");
			}
		}
		
		log.info("################### FIM RELATORIO DA CARGA ###################");
		log.info("##############################################################");

		return stepExecution.getExitStatus();
	}

}