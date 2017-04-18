package br.gov.serpro.supde.infra.batch.admin.web.resources;

import org.springframework.stereotype.Component;

@Component
public class InfraBean {

	public String getJobRepositoryURL() {
		return System.getProperty("batch.jdbc.url");		
	}

}

