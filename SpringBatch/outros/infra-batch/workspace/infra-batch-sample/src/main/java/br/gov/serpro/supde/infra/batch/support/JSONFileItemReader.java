package br.gov.serpro.supde.infra.batch.support;

import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.separator.JsonRecordSeparatorPolicy;

public class JSONFileItemReader<T> extends FlatFileItemReader<T> {

	public JSONFileItemReader() {
		super();
		super.setRecordSeparatorPolicy(new JsonRecordSeparatorPolicy());		
	}

}