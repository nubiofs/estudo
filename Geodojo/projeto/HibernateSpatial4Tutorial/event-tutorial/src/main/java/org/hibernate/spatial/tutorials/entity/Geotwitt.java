package org.hibernate.spatial.tutorials.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.Type;

import com.vividsolutions.jts.geom.Point;

@Entity
public class Geotwitt {

	@Id
	@GeneratedValue
	private Long id;
		
	private String autor;
	
	@Column(length=140)
	private String mensagem;
	
	@Column(name = "geom")
    @Type(type = "org.hibernate.spatial.GeometryType")
	private Point location;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAutor() {
		return autor;
	}

	public void setAutor(String autor) {
		this.autor = autor;
	}

	public String getMensagem() {
		return mensagem;
	}

	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
	}

	public Point getLocation() {
		return location;
	}

	public void setLocation(Point location) {
		this.location = location;
	}
	
}
