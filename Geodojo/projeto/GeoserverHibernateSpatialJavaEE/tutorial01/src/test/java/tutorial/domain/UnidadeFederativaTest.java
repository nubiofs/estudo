package tutorial.domain;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import tutorial.domain.UnidadeFederativa;
import tutorial.util.JPAUtil;

public class UnidadeFederativaTest {

	static EntityManager em;
	static Query SQL_GET;

	@BeforeClass
	public static void beforeClass() {
		em = JPAUtil.createEntityManager();
		em.getTransaction().begin();
		SQL_GET = em.createQuery(
				"select u from UnidadeFederativa u where u.nome = :uf", UnidadeFederativa.class);
	}

	@AfterClass
	public static void after() {
		JPAUtil.close();
	}

	@Test
	public void getUfPernambuco() {

		String uf = "PERNAMBUCO";
		SQL_GET.setParameter("uf", uf);

		@SuppressWarnings("unchecked")
		List<UnidadeFederativa> ufList = (List<UnidadeFederativa>) SQL_GET.getResultList();

		for(UnidadeFederativa un : ufList){
			System.out.println("id = " + un.getId() + " | " + 
					"Nome = " + un.getNome() + " | " +
					"Geo = " + un.getPoligono());
		}

	}

}
