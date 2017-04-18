package br.gov.serpro.supde.infra.batch.core.report;

/**
 * <p>
 * Parâmetro de execução de um Job
 * </p>
 * 
 */
public class JobParameter {
	
	/**
	 * Chave do parâmetro
	 */
	private final String key;
	
	/**
	 * Valor do parâmetro
	 */
	private final String value;

	public JobParameter(String key, String value) {
		super();
		this.key = key;
		this.value = value;
	}

	/**
	 * @return the key
	 */
	public String getKey() {
		return key;
	}

	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}
	
}
