package hello;
/*
 * Copyright 2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Example;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CustomerRepositoryTests {

    @Autowired
    public CustomerRepository repository;

	@Autowired
	private MongoOperations template;

    Customer dave, oliver, carter;

    @Before
    //@Test
    public void setUp() {

        repository.deleteAll();

        dave = repository.save(new Customer("3", "Dave", "Matthews", Integer.valueOf(20), Arrays.asList(new Phone("222-000"))));
        oliver = repository.save(new Customer("4", "Oliver August", "Matthews", Integer.valueOf(33), Arrays.asList(new Phone("333-333"))));
        carter = repository.save(new Customer("5", "Carter", "Beauford", Integer.valueOf(37), Arrays.asList(new Phone("333-777"))));
        
        repository.save(new Customer("6", "Carter_", "Beauford_", Integer.valueOf(37), Arrays.asList(new Phone("333-777"))));

    }

    @Test
    public void setsIdOnSave() {

        Customer dave_ = repository.save(new Customer("7", "Dave_", "Matthews_", Integer.valueOf(31), Arrays.asList(new Phone("123-111"))));

        assertThat(dave_.identity).isNotNull();
        
    }

    @Test
    public void findsByLastName() {

        List<Customer> result = repository.findByLastName("Beauford");

        assertThat(result).hasSize(1).extracting("firstName").contains("Carter");
    }

    @Test
    public void findsByExample() {

        Customer probe = new Customer(null, null, "Matthews", null, null);

        List<Customer> result = repository.findAll(Example.of(probe));

        assertThat(result).hasSize(2).extracting("firstName").contains("Dave", "Oliver August");
    }
    
    @After
    //@Test
    public void addToSet_pushAll() {

    	Query query = Query.query(Criteria.where("firstName").is("Carter_"));
    	Update update = Update.update("lastName", "Beauford_");
    	
    	//Operador addToSet:
    	update.addToSet("phones", new Phone("123-123"));
		template.upsert(query, update, Customer.class);

		//Operador pushAll:
		update = Update.update("lastName", "Beauford_");
		update.pushAll("phones", Arrays.asList(new Phone("111-111"), new Phone("222-222")).toArray());
		template.upsert(query, update, Customer.class);
		
        Customer cater_ = new Customer(null, "Carter_", null, null, null);
        List<Customer> result = repository.findAll(Example.of(cater_));
		
        assertThat(result).hasSize(1);
        assertThat(result.get(0).id).isNotNull();
        assertTrue(result.get(0).phones.size() == 4);
        //assertTrue(result.get(0).phones.contains(new Phone("123-123")));
        //assertThat(result).hasSize(1).extracting("phones");
        //assertThat(result).hasSize(1).extracting("phones").contains(new Phone("123-123"), new Phone("222-222"));
        //System.out.println("\t" + repository.findByFirstName("Carter_"));
        
    }
    
}