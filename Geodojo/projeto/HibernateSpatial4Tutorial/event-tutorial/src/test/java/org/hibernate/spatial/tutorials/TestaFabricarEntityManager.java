package org.hibernate.spatial.tutorials;

import javax.persistence.Persistence;

import org.junit.Assert;
import org.junit.Test;

public class TestaFabricarEntityManager {
	
	@Test
	public void testEntityManagerFactory()
	{
				
		try {
			
			Persistence.createEntityManagerFactory("org.hibernate.events.jpa").createEntityManager().getTransaction().begin();
			
		} catch (Throwable e) {
			
			Assert.fail();
		}

	}
	
}
