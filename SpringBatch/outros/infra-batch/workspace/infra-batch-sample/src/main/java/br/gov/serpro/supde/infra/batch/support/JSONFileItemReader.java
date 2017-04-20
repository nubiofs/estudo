package br.gov.serpro.supde.infra.batch.support;

import org.springframework.batch.item.file.FlatFileItemReader;

import br.gov.serpro.supde.infra.batch.core.support.DefaultRecordSeparatorPolicy;

public class JSONFileItemReader<T> extends FlatFileItemReader<T> {

	public JSONFileItemReader() {
		super();
		//super.setRecordSeparatorPolicy(new JsonRecordSeparatorPolicy());
		super.setRecordSeparatorPolicy(new DefaultRecordSeparatorPolicy());
	}

}