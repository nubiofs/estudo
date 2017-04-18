package br.gov.serpro.supde.infra.batch.core.transaction;

import br.gov.serpro.supde.infra.batch.core.context.InfraJobContext;

public class DataSourceCredentials {
	
	private String user;
	
	private String password;
	
	public DataSourceCredentials() {
		String system = InfraJobContext.getInstance().getSystem();
		if(system == null) {
			system = "";
		}
		
		String preffix = system.length() > 0 ? "infra-" + system : "infra" ;
		
		user = System.getProperty(preffix + ".jdbc.user");
		password = System.getProperty(preffix + ".jdbc.password");
		
		
	}

	public String getUser() {
		return user;
	}

	public String getPassword() {
		return password;
	}

}
