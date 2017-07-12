package hello;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) throws Exception {
    	
    	//Spring Boot’s SpringApplication.run() method to launch an application.
        SpringApplication.run(Application.class, args);
    }
    
}