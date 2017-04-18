package br.gov.serpro.supde.infra.batch.core.support;

import org.springframework.batch.item.file.separator.SimpleRecordSeparatorPolicy;
import org.springframework.util.StringUtils;

/**
 * RecordSeparatorPolicy genérico para tratar os delimitadores de String.
 * Por padrão é utilizado " como delimitador. Mas pode ser configuravel através do atributo stringDelimiter.
 * 
 *  Este RecordSeparatorPolicy é utilizado para resolver o problema de ao se converter planilhas ODS em CSV,
 *  para as células que possuem quebra de linha no seu conteúdo. 
 * 
 * @author 05601970475
 *
 */
public class DefaultRecordSeparatorPolicy extends SimpleRecordSeparatorPolicy {

	private static final String DEFAULT_STRING_DELIMITER = "\"";
	
	private String stringDelimiter;
	
	public DefaultRecordSeparatorPolicy() {
		stringDelimiter = DEFAULT_STRING_DELIMITER;
	}
	
	@Override
	public boolean isEndOfRecord(String line) {
		return StringUtils.countOccurrencesOf(line, stringDelimiter) % 2 == 0;
	}

	public String getStringDelimiter() {
		return stringDelimiter;
	}

	public void setStringDelimiter(String stringDelimiter) {
		this.stringDelimiter = stringDelimiter;
	}

}
