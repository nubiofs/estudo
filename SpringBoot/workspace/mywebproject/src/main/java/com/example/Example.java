package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * https://spring.io/guides/gs/spring-boot/
 * 
 *
 */
@RestController
@EnableAutoConfiguration
@SpringBootApplication
public class Example {

	@RequestMapping("/")
	String home() {
		return "Hello World!";
	}
	
	@RequestMapping("/oi")
    public String index() {
        return "Greetings from Spring Boot!";
    }

	public static void main(String[] args) throws Exception {
		SpringApplication.run(Example.class, args);
	}

//	@Bean
//    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
//        return args -> {
//
//            System.out.println("Let's inspect the beans provided by Spring Boot:");
//
//            String[] beanNames = ctx.getBeanDefinitionNames();
//            Arrays.sort(beanNames);
//            for (String beanName : beanNames) {
//                System.out.println(beanName);
//            }
//
//        };
//    }
	
}
