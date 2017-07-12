package br.gov.serpro.supde.infra.batch.sample.domain;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Experience implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String name;
	private String country;
	private Date birthdate;
	private String company;
	private String depto;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getCountry() {
		return country;
	}
	
	public void setCountry(String country) {
		this.country = country;
	}
	
	public Date getBirthdate() {
		return birthdate;
	}
	
	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}
	
	public String getBirthdateFormatted() {
		String result = null;
		if(birthdate != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
			result = sdf.format(birthdate);
		}
		
		return result;
	}

	public String getCompany() {
		return company;
	}
	
	public void setCompany(String company) {
		this.company = company;
	}
	
	public String getDepto() {
		return depto;
	}
	
	public void setDepto(String depto) {
		this.depto = depto;
	}
	
}
