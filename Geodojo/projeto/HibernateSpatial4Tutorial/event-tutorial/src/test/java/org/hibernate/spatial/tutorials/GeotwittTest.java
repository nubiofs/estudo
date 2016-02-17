package org.hibernate.spatial.tutorials;

import static org.junit.Assert.assertTrue;

import java.util.List;

import javax.persistence.EntityManager;

import org.hibernate.spatial.tutorials.entity.Geotwitt;
import org.hibernate.spatial.tutorials.util.JPAUtil;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;

public class GeotwittTest {

	static EntityManager em;

	@BeforeClass
	public static void beforeClass() {
		em = JPAUtil.createEntityManager();
	}

	@AfterClass
	public static void after() {
		JPAUtil.close();
	}

	@Test
	public void inserir() {

		//Ponto Central Foz do Iguacu
		//-25.411051, -54.538899
		Coordinate coord = new Coordinate(-25.4607, -54.5820);
		Point location = new GeometryFactory().createPoint(coord);
		location.setSRID(4326);

		Geotwitt twitt = new Geotwitt();
		twitt.setAutor("Nubio");
		twitt.setMensagem("Testando o nosso primeiro #geotwitt com localizacao");
		twitt.setLocation(location);

		em.getTransaction().begin();
		em.persist(twitt);
		em.getTransaction().commit();

	}

	@Test
	public void atualizar()	{

		Geotwitt twitt = (Geotwitt) em.createQuery("from Geotwitt")
				.setMaxResults(1).getSingleResult();
		
		twitt.setAutor("Nubio");
		twitt.setMensagem("Testando o nosso primeiro #geotwitt com localizacao. UPDATED");
		
		em.getTransaction().begin();
		em.merge(twitt);
		em.getTransaction().commit();

	}

	@Test
	public void procurarRemover()	{

		@SuppressWarnings("unchecked")
		List<Geotwitt> twitts = em.createQuery("from Geotwitt").getResultList();
		
		assertTrue(twitts.size() > 0);
		
		em.getTransaction().begin();
		
		for (Geotwitt geotwitt : twitts) {
		
			em.remove(geotwitt);
			
		}
		
		em.getTransaction().commit();

	}

}
