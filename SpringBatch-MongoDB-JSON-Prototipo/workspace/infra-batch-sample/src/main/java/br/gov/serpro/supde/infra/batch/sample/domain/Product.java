package br.gov.serpro.supde.infra.batch.sample.domain;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

import br.gov.serpro.supde.infra.batch.support.ColorAccepted;
import br.gov.serpro.supde.infra.batch.support.TypeAccepted;
import br.gov.serpro.supde.infra.batch.util.Constantes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public final class Product implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@NotNull
	//@Digits(fraction = 0, integer = 0)
	//@Max(value = 0)
	private Integer id;
	
	@NotEmpty
	//@NotBlank
	@Length(min = 1, max = 100)
	private String name;
	
	@Length(min = 0, max = 100)
	private String brand;
	
	@TypeAccepted
	private String type;
	
	@ColorAccepted(acceptValues = { Constantes.GREEN, Constantes.BLACK, Constantes.RED }, message = "Invalid color")
	private String color;

	//@Size(max = 100)
	private Double price;
	private Double warranty_years;
	private Boolean available;
	
	@Length(min = 0, max = 16000)
	private String description;
	
	@NotEmpty
	private String json;
	
	public Product(){
		
	}
	
	private Product(Builder builder) {
		this.id = builder.id;
		this.name = builder.name;
		this.brand = builder.brand;
		this.type = builder.type;
		this.color = builder.color;
		this.price = builder.price;
		this.warranty_years = builder.warranty_years;
		this.available = builder.available;
		this.description = builder.description;
		this.json = builder.json;
	}

	public static Builder getBuilder() {
        return new Builder();
    }

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

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
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
	
	public String getJson() {
		return json;
	}
	
	public void setJson(String json) {
		this.json = json;
	}
	
	@Override
	public String toString(){

		final ToStringBuilder builder = new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE);
		
		builder.append("id", id)
		.append("name", name)
		.append("brand", brand)
		.append("type", type)
		.append("color", color)
		.append("price", price)
		.append("warranty_years", warranty_years)
		.append("available", available)
		.append("description", description)
		.append("json", json);
		
		return builder.toString();

	}
	
	/**
     * Builder pattern makes the object easier to construct in one line.
     */
    public static class Builder {

    	private Integer id;
    	private String name;
    	private String brand;
    	private String type;
    	private String color;
    	private Double price;
    	private Double warranty_years;
    	private Boolean available;
    	private String description;
    	private String json;

        private Builder() {}

        public Builder id(Integer id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder brand(String brand) {
            this.brand = brand;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }
        
        public Builder color(String color) {
            this.color = color;
            return this;
        }

        public Builder price(Double price) {
            this.price = price;
            return this;
        }

        public Builder warranty_years(Double warranty_years) {
            this.warranty_years = warranty_years;
            return this;
        }

        public Builder available(Boolean available) {
            this.available = available;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder json(String json) {
            this.json = json;
            return this;
        }

        public Product build() {
        	return new Product(this);
        }

    }
	
}
