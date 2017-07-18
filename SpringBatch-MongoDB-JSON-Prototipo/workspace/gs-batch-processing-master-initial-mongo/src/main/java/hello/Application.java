package hello;

import hello.batch.nosql.spring.data.mongo.CarroRepository;
import hello.pojo.Carro;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

	@Autowired
	private static CarroRepository repository;

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
		
//		repository.deleteAll();
//
//		// save a couple of customers
//		repository.save(new Carro("2", "gol"));
//		repository.save(new Carro("130", "fusca"));
//
//		// fetch all customers
//		System.out.println("Carros found with findAll():");
//		System.out.println("-------------------------------");
//		for (Carro customer : repository.findAll()) {
//			System.out.println(customer);
//		}
//		System.out.println();
//
//		// fetch an individual customer
//		System.out.println("Carro found with findByFirstName('gol'):");
//		System.out.println("--------------------------------");
//		System.out.println(repository.findByNome("gol"));
		
		//teste+
//		MongoOperations mongoOps = new MongoTemplate(new MongoClient(), "test");
//	    mongoOps.insert(new Carro("-1", "NONE"));
//	    System.out.println("mongoOps: " + mongoOps.findOne(new Query(where("nome").is("NONE")), Carro.class));
//	    // Update
//	    //mongoOps.updateFirst(query(where("name").is("Joe")), update("age", 35), Person.class);
//	    /*
//	    Query query = new Query(Criteria.where("firstName").is("Harry"));
//		Update update = new Update().inc("age", 1);
//		Person p = mongoTemplate.findAndModify(query, update, Person.class); // return's old person object
//	     */
////	    List<Person> result = mongoTemplate.find(query(where("age").lt(50)
////	    		  .and("accounts.balance").gt(1000.00d)), Person.class);
//	    mongoOps.dropCollection("carro");
		//teste-
	}

}