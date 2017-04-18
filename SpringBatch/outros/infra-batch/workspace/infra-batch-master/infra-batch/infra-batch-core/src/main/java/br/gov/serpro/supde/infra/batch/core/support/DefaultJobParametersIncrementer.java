package br.gov.serpro.supde.infra.batch.core.support;

import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersIncrementer;

/**
 * JobParametersIncrementer padrão para o jog.
 * 
 * Para utilizar, execute o Job com o parâmetro -next o infraJobParent já registra este Incrementer.
 * 
 * @author 05601970475
 *
 */
public class DefaultJobParametersIncrementer implements JobParametersIncrementer {
	
	/**
	 * Parâmetro criado pelo incrementer para diferenciar execuções do Job.
	 */
	private static final String INCREMENTER_PARAM_KEY = "run.incrementer";

	public JobParameters getNext(JobParameters parameters) {
		if (parameters == null || parameters.isEmpty()) {
			return new JobParametersBuilder().addLong(INCREMENTER_PARAM_KEY, 1L).toJobParameters();
		}
		long id = Long.parseLong(parameters.getString(INCREMENTER_PARAM_KEY, "1")) + 1;
		return new JobParametersBuilder().addLong(INCREMENTER_PARAM_KEY, id).toJobParameters();
	}

}
