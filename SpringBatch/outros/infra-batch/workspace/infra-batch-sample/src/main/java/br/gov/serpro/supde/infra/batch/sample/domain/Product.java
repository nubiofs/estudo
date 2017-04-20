package br.gov.serpro.supde.infra.batch.sample.domain;

import java.io.Serializable;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

public class Product implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String name;
	private String brand;
	private String type;
	private Integer price;
	private Integer warranty_years;
	private Boolean available;
	private String description;

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

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Integer getWarranty_years() {
		return warranty_years;
	}

	public void setWarranty_years(Integer warrantyyears) {
		this.warranty_years = warrantyyears;
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
