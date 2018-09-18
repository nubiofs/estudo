package hello;

import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.ApplicationContext;

/**
 * https://github.com/eugenp/tutorials/tree/master/spring-boot-autoconfiguration
 * 
 * https://stackoverflow.com/questions/43255169/spring-jpa-at-least-one-jpa-metamodel-must-be-present/43305661
 * 
 *
 */
@SpringBootApplication
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class})
public class Application {

//	@Autowired
//	private JobRepository jobRepository;
	
    public static void main(String[] args) throws Exception {
    	
    	ApplicationContext context =SpringApplication.run(Application.class, args);
 
    	JobRepository jobRepository = context.getBean(JobRepository.class);
    	System.out.println("jobRepository.toString(): " + jobRepository.toString());
        
    	//JobLauncher jobLauncher = context.getBean(JobLauncher.class);
    	
    }
    
}
