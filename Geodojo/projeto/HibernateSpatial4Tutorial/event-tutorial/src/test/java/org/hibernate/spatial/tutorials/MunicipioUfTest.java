package org.hibernate.spatial.tutorials;

import java.util.List;
import static org.junit.Assert.*;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import org.hibernate.spatial.tutorials.entity.Municipio;
import org.hibernate.spatial.tutorials.util.JPAUtil;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

public class MunicipioUfTest {

	static EntityManager em;
	static Query SQL_GET;

	@BeforeClass
	public static void beforeClass() {
		em = JPAUtil.createEntityManager();
		em.getTransaction().begin();
		SQL_GET = em.createQuery(
				//select m from municipios_br m where m.nomemicro = 'RECIFE';
				"select m from Municipio m where m.nome = :cidade", Municipio.class);
	}

	@AfterClass
	public static void after() {
		JPAUtil.close();
	}

	@Test
	public void getMunicipioRecife() {

		String cidadeRecife = "RECIFE";
		SQL_GET.setParameter("cidade", cidadeRecife);

		@SuppressWarnings("unchecked")
		List<Municipio> municipioList = (List<Municipio>) SQL_GET.getResultList();

		for(Municipio m : municipioList){
			System.out.println("gid = " + m.getId() + " | " + 
					"Nome = " + m.getNome() + " | " +
					"Geo = " + m.getPoligono());
		}

	}
	
	@Test
	public void getMunicipiosUF()
	{
		//select m from municipios_br m where m.nomemicro like 'ARACA%';
		Query query = em.createQuery("from Municipio where uf = :uf ").setParameter("uf", "SERGIPE");
		
		List<Municipio> municipiosSergipanos = query.getResultList();
		
		int quantidadeMunicipios = municipiosSergipanos.size();
		System.out.println(quantidadeMunicipios);
		assertTrue(quantidadeMunicipios == 75);
		
	}
	
	@Test
	public void testaConsultaEspacial()
	{
		Query query = em.createQuery(
				"select m from Municipio m, UnidadeFederativa uf where uf.nome = :uf and "
				+ "st_within(m.poligono, uf.poligono) = true ")
				.setParameter("uf", "SERGIPE");
		
		List<Municipio> municipiosSergipanos = query.getResultList();
		
		assertTrue(municipiosSergipanos.size() == 75);
		
	}

}
