package hello;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import hello.pojo.Carro;
import hello.pojo.Person;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.MongoClient;

@SpringBootApplication
public class Application {

//	@Bean
//	public DataSource dataSource(Environment environment) {
//		DriverManagerDataSource dataSource = new DriverManagerDataSource();
//		dataSource.setDriverClassName("org.h2.Driver");
//		dataSource.setUrl("jdbc:h2:mem:test");
//		dataSource.setUsername("sa");
//		dataSource.setPassword("sa");
//		//Acessar "http://localhost:8080/h2console/"
//		//e criar rodar comandos DDL (spring-batch-core-3.0.7.RELEASE):
//		//Executing SQL script from class path resource [org/springframework/batch/core/schema-h2.sql
//		return dataSource;
//	}

	public static void main(String[] args) throws Exception {

		//Spring Boot’s SpringApplication.run() method to launch an application.
		SpringApplication.run(Application.class, args);
		
		//teste+
		MongoOperations mongoOps = new MongoTemplate(new MongoClient(), "test");
	    mongoOps.insert(new Carro("-1", "NONE"));
	    System.out.println("mongoOps: " + mongoOps.findOne(new Query(where("nome").is("NONE")), Carro.class));
	    // Update
	    //mongoOps.updateFirst(query(where("name").is("Joe")), update("age", 35), Person.class);
	    /*
	    Query query = new Query(Criteria.where("firstName").is("Harry"));
		Update update = new Update().inc("age", 1);
		Person p = mongoTemplate.findAndModify(query, update, Person.class); // return's old person object
	     */
	    mongoOps.dropCollection("carro");
		//teste-
	}

}