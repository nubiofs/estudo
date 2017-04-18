package br.gov.serpro.supde.infra.batch.core.support;

import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;

/**
 * LineMapper padrão para arquivos CSV.
 * 
 * @author 05601970475
 *
 * @param <T>
 */
public class CSVLineMapper<T> extends DefaultLineMapper<T> {

	public CSVLineMapper() {
		super();
		super.setLineTokenizer(new DelimitedLineTokenizer());		
	}

}
