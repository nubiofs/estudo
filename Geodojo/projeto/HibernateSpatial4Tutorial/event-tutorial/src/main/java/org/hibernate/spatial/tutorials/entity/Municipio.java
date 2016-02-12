package org.hibernate.spatial.tutorials.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Municipio {
	
	@Id
	@GeneratedValue
	private Long gid;

}
