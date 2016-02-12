package org.hibernate.spatial.tutorials;

import static org.junit.Assert.assertEquals;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.hibernate.spatial.tutorials.entity.Event;
import org.hibernate.spatial.tutorials.util.GeometryUtil;
import org.hibernate.spatial.tutorials.util.JPAUtil;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.vividsolutions.jts.geom.Geometry;

public class EventTest {

	EntityManager em;
	
	@Before
	public void before() {
		em = JPAUtil.createEntityManager();
		em.getTransaction().begin();
	}
	
	@After
	public void after() {
		JPAUtil.close();
	}
	
	@Test
	public void getPoint() {

		Query query = em.createQuery(
				"select e from Event e where st_within(e.location, :geo) = true", Event.class);
		
		Geometry geo = GeometryUtil.wktToGeometry("POINT(10 5)");
		query.setParameter("geo", geo);
		
		Event event = (Event) query.getResultList().get(0);

		assertEquals("My Event", event.getTitle());
		
	}

}
