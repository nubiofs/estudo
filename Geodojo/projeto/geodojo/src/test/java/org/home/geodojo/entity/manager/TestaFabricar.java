package org.home.geodojo.entity.manager;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.junit.Assert;
import org.junit.Test;

public class TestaFabricar {
	
	@Test
	public void testEntityManagerFactory()
	{
				
		try {
			
			EntityManagerFactory emf = Persistence.createEntityManagerFactory("geodojodbspatial");
			EntityManager em = emf.createEntityManager();
			em.getTransaction().begin();
			
		} catch (Throwable e) {
			
			Assert.fail();
		}

	}

}
