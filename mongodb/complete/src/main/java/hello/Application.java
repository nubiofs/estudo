package hello;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@SpringBootApplication
public class Application implements CommandLineRunner {

	@Autowired
	private CustomerRepository repository;
	
	@Autowired
	private MongoOperations template;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		repository.deleteAll();

		// save a couple of customers
		repository.save(
				new Customer(
						"1",
						"Alice", 
						"Smith",
						Integer.valueOf(30),
						Arrays.asList(new Phone("123-123"), new Phone("456-456"))));
		
		repository.save(
				new Customer(
						"2",
						"Bob", 
						"Smith_",
						Integer.valueOf(40),
						Arrays.asList(new Phone("789-789"))));
		
		System.out.println();

		// fetch all customers
		System.out.println("Customers found with findAll():");
		System.out.println("-------------------------------");
		for (Customer customer : repository.findAll()) {
			System.out.println("\t" + customer);
		}
		System.out.println();

		// fetch an individual customer
		System.out.println("Customer found with findByFirstName('Alice'):");
		System.out.println("--------------------------------");
		System.out.println("\t" + repository.findByFirstName("Alice"));
		System.out.println();

		System.out.println("Customers found with findByLastName('Smith_'):");
		System.out.println("--------------------------------");
		for (Customer customer : repository.findByLastName("Smith_")) {
			System.out.println("\t" + customer);
		}
		System.out.println();
		
		Query query = Query.query(Criteria.where("firstName").is("Bob"));
		Update update = Update.update("age", Integer.valueOf(42))
				.set("lastName", "Smith")
				//.set("phones", Arrays.asList(new Phone("123-123")));//SUBSTITUI TUDO!
				.addToSet("phones", new Phone("123-123"));
		template.upsert(query, update, Customer.class);

		// fetch an individual customer
		System.out.println("Customer found with findByFirstName('Bob') AFTER UPSERT:");
		System.out.println("--------------------------------");
		System.out.println("\t" + repository.findByFirstName("Bob"));
		System.out.println();
		
	}

}
