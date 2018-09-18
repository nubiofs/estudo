package hello;

import java.io.Serializable;

public class People implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer id;

	private String first_name;
	private String last_name;
	
	public People() {
	}

	public People(String first_name, String last_name) {
		this.first_name = first_name;
		this.last_name = last_name;
	}
	
	public String getFirst_name() {
		return first_name;
	}
	
	public void setFirst_name(String first_name) {
		this.first_name = first_name;
	}
	
	public String getLast_name() {
		return last_name;
	}

	public void setLast_name(String last_name) {
		this.last_name = last_name;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	
	public Integer getId() {
		return id;
	}
	
	@Override
	public String toString() {
		return "firstName: " + first_name + ", lastName: " + last_name;
	}

}
