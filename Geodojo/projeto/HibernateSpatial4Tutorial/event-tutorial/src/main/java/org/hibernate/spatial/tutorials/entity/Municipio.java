package org.hibernate.spatial.tutorials.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.Type;

import com.vividsolutions.jts.geom.MultiPolygon;

@Entity
public class Municipio {

	@Id
	@GeneratedValue
	private Long gid;

	private String nome;

	private String uf;

	@Column(name = "the_geom")
	@Type(type = "org.hibernatespatial.GeometryUserType")
	private MultiPolygon poligono;

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getUf() {
		return uf;
	}

	public void setUf(String uf) {
		this.uf = uf;
	}

	public MultiPolygon getPoligono() {
		return poligono;
	}

	public void setPoligono(MultiPolygon poligono) {
		this.poligono = poligono;
	}

}
