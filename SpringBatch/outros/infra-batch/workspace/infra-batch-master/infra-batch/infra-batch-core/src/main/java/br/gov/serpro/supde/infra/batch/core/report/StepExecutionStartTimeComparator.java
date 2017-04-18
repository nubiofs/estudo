package br.gov.serpro.supde.infra.batch.core.report;

import java.util.Comparator;
import java.util.Date;

/**
 * <p>
 * {@link Comparator} para a ordenação de execuções de um passo por data de início de
 * execução.
 * </p>
 * 
 */
public class StepExecutionStartTimeComparator implements Comparator<StepExecution> {

	private static final int LESS = -1;
	private static final int EQUALS = 0;
	private static final int GREATER = 1;

	/**
	 * <p>
	 * Compara duas execuções de passo, com base na data de início de execução.
	 * </p>
	 * 
	 * @param stepExecution1
	 * @param stepExecution2
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
	public int compare(StepExecution stepExecution1, StepExecution stepExecution2) {
		
		if (stepExecution1 == null && stepExecution2 == null) {
			return EQUALS;
		}
		else if (stepExecution1 == null && stepExecution2 != null) {
			return LESS; // as execucoes nulas vem antes
		}
		else if (stepExecution1 != null && stepExecution2 == null) {
			return GREATER; // as execucoes nulas vem antes
		}
		else {
			Date startTime1 = stepExecution1.getStartTime();
			Date startTime2 = stepExecution2.getStartTime();
			
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
