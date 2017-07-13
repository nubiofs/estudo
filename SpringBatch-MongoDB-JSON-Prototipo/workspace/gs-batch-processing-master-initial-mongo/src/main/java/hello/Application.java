package hello;

import javax.sql.DataSource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@SpringBootApplication
public class Application {

	@Bean
	public DataSource dataSource(Environment environment) {
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("org.h2.Driver");
		dataSource.setUrl("jdbc:h2:mem:test");
		dataSource.setUsername("sa");
		dataSource.setPassword("sa");
		//Acessar "http://localhost:8080/h2console/"
		//e criar rodar comandos DDL (spring-batch-core-3.0.7.RELEASE):
		//Executing SQL script from class path resource [org/springframework/batch/core/schema-h2.sql
		return dataSource;
	}

	public static void main(String[] args) throws Exception {

		//Spring Boot’s SpringApplication.run() method to launch an application.
		SpringApplication.run(Application.class, args);
	}

}