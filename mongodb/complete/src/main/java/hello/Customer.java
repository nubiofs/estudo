package hello;

import java.util.List;

import org.springframework.data.annotation.Id;

public class Customer {

    @Id
    public String id;
    
    public String identity;

    public String firstName;
    public String lastName;
    
    public Integer age;
    
    public List<Phone> phones;

    public Customer() {}

    public Customer(String identity, String firstName, String lastName, Integer age, List<Phone> phones) {
    	this.identity = identity;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.phones = phones;
    }

    @Override
    public String toString() {
        return String.format(
                "Customer [identity=%s, firstName='%s', lastName='%s', age='%s', [phones={'%s'}]]",
                identity, firstName, lastName, age, phones);
    }

}

