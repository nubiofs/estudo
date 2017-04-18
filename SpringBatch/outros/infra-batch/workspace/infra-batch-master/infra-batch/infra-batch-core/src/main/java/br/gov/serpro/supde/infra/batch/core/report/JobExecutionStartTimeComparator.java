package br.gov.serpro.supde.infra.batch.core.report;

import java.util.Comparator;
import java.util.Date;

/**
 * <p>
 * {@link Comparator} para a ordenação de execuções por data de início de
 * execução.
 * </p>
 * 
 */
public class JobExecutionStartTimeComparator implements Comparator<JobExecution> {

	private static final int LESS = -1;
	private static final int EQUALS = 0;
	private static final int GREATER = 1;

	/**
	 * <p>
	 * Compara duas execuções, com base na data de início de execução.
	 * </p>
	 * 
	 * @param jobExecution1
	 * @param jobExecution2
	 * @return <ul>
	 *         <li>O valor <code>0</code>, se a primeira execução começou no
	 *         mesmo instante que a segunda execução;</li>
	 *         <li>Um valor menor do que <code>0</code>, se a primeira execução
	 *         iniciou antes da segunda execução;</li>
	 *         <li>Um valor maior do que <code>0</code>, se a primeira execução
	 *         iniciou depois da segunda execução.</li>
	 *         </ul>
	 */
	@Override
	public int compare(JobExecution jobExecution1, JobExecution jobExecution2) {
		
		if (jobExecution1 == null && jobExecution2 == null) {
			return EQUALS;
		}
		else if (jobExecution1 == null && jobExecution2 != null) {
			return LESS; // as execucoes nulas vem antes
		}
		else if (jobExecution1 != null && jobExecution2 == null) {
			return GREATER; // as execucoes nulas vem antes
		}
		else {
			Date startTime1 = jobExecution1.getStartTime();
			Date startTime2 = jobExecution2.getStartTime();
			
			if (startTime1 == null && startTime2 == null) {
				return EQUALS;
			}
			else if (startTime1 == null && startTime2 != null) {
				return LESS; // as datas nulas vem antes
			}
			else if (startTime1 != null && startTime2 == null) {
				return GREATER; // as datas nulas vem antes
			}
			else {
				return startTime1.compareTo(startTime2);
			}
			
		}
		
	}
	
}
