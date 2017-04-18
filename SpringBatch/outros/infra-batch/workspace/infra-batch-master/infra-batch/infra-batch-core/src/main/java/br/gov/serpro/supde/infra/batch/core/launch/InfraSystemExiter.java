package br.gov.serpro.supde.infra.batch.core.launch;

import org.springframework.batch.core.launch.support.SystemExiter;

public class InfraSystemExiter implements SystemExiter {

	@Override
	public void exit(int status) {
		System.out.println("Encerrando aplicação com status = " + status);		
		System.exit(status);
	}
	
}
