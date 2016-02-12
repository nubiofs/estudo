package org.hibernate.spatial.tutorials;

import static org.junit.Assert.assertEquals;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.hibernate.spatial.tutorials.entity.Event;
import org.hibernate.spatial.tutorials.util.GeometryUtil;
import org.hibernate.spatial.tutorials.util.JPAUtil;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.Point;

public class EventTest {

	static EntityManager em;
	static Query SQL_GET_POINT;
	String NOVO_PONTO = "POINT(55 77)";
	
	@BeforeClass
	public static void beforeClass() {
		em = JPAUtil.createEntityManager();
		em.getTransaction().begin();
		SQL_GET_POINT = em.createQuery(
				"select e from Event e where st_within(e.location, :geo) = true", Event.class);
	}
	
	@AfterClass
	public static void after() {
		JPAUtil.close();
	}
	
	@Test
	public void getPoint() {

		Geometry geo = GeometryUtil.wktToGeometry("POINT(10 5)");
		SQL_GET_POINT.setParameter("geo", geo);
		
		Event event = (Event) SQL_GET_POINT.getResultList().get(0);

		assertEquals("My Event", event.getTitle());
		
	}
	
	@Test
	public void crudNovoPonto() {
		
		//
		//Inserção do Novo ponto
		//
		String tituloNovoPonto = "Novo Ponto";
		Geometry ponto = GeometryUtil.wktToGeometry(NOVO_PONTO);

        if (!ponto.getGeometryType().equals("Point")) {
            throw new RuntimeException("Geometry must be a point. Got a " + ponto.getGeometryType());
        }

        Event theEvent = new Event();
        theEvent.setTitle(tituloNovoPonto);
        theEvent.setDate(new Date());
        theEvent.setLocation((Point) ponto);
        em.persist(theEvent);
        em.getTransaction().commit();
        
		//
		//Consulta do Novo ponto
		//
		SQL_GET_POINT.setParameter("geo", ponto);
		
		Event event = (Event) SQL_GET_POINT.getResultList().get(0);

		assertEquals(tituloNovoPonto, event.getTitle());
		
	}

}
