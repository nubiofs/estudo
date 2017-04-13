package org.tutorial.QuickStart;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.springframework.boot.SpringApplication;

public class Main {

	@Inject
	private Logger logger;

	public static void main(String [] args) {
		
		System.exit(
				SpringApplication.exit(
						SpringApplication.run(BatchConfiguration.class, args)));

	}
	
	public void say(){
		logger.info("Procesando Spring batch...");
	}

}
