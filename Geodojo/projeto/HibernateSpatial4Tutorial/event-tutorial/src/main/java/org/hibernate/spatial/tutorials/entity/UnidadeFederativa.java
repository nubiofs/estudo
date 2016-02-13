package org.hibernate.spatial.tutorials.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.Type;
import com.vividsolutions.jts.geom.MultiPolygon;

@Entity
@Table(name="uf")
public class UnidadeFederativa {
	
	@Id
	@GeneratedValue
	@Column(name = "id")
	private Long id;
	
	@Column(name = "nome")
	private String nome;
	
	@Column(name = "geom")
	@Type(type="org.hibernate.spatial.GeometryType")
	private MultiPolygon poligono;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public MultiPolygon getPoligono() {
		return poligono;
	}

	public void setPoligono(MultiPolygon poligono) {
		this.poligono = poligono;
	}
	
}
