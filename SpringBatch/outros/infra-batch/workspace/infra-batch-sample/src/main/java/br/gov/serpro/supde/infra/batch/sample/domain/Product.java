package br.gov.serpro.supde.infra.batch.sample.domain;

import java.io.Serializable;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

//http://springbatchbyexample.blogspot.com.br/2014/09/validation-input-data.html
//http://javabeat.net/introduction-to-spring-validation/
//http://springbatchbyexample.blogspot.com.br/2014/09/configure-spring-batch-admin-to-use.html
public class Product implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private String name;
	private String brand;
	private String type;
	private Double price;
	private Double warranty_years;
	private Boolean available;
	private String description;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getWarranty_years() {
		return warranty_years;
	}
	
	public void setWarranty_years(Double warranty_years) {
		this.warranty_years = warranty_years;
	}
	
	public Boolean getAvailable() {
		return available;
	}

	public void setAvailable(Boolean available) {
		this.available = available;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	@Override
	public String toString(){

		final ToStringBuilder builder = new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE);
		
		builder.append("id", id)
		.append("name", name)
		.append("brand", brand)
		.append("type", type)
		.append("price", price)
		.append("warranty_years", warranty_years)
		.append("available", available)
		.append("description", description);
		
		return builder.toString();

	}
	
}
