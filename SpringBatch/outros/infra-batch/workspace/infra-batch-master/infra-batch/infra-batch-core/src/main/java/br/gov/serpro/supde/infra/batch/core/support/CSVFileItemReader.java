package br.gov.serpro.supde.infra.batch.core.support;

import org.springframework.batch.item.file.FlatFileItemReader;

/**
 * Reader padrão para arquivos CSV.
 * 
 * @author 05601970475
 *
 * @param <T>
 */
public class CSVFileItemReader<T> extends FlatFileItemReader<T> {

	public CSVFileItemReader() {
		super();
		super.setRecordSeparatorPolicy(new DefaultRecordSeparatorPolicy());		
	}

}
