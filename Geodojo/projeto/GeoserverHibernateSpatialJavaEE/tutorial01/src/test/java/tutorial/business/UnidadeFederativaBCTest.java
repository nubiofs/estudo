package tutorial.business;

import static org.junit.Assert.assertEquals;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;

import br.gov.frameworkdemoiselle.junit.DemoiselleRunner;
import tutorial.domain.UnidadeFederativa;

@RunWith(DemoiselleRunner.class)
public class UnidadeFederativaBCTest {

	@Inject
	private UnidadeFederativaBC ufBC;
	//private UnidadeFederativaBC ufBC = new UnidadeFederativaBC();
	
	@Test
	public void load() {
		ufBC.load();
	}
	
	@Test
	public void getId() {
		
		UnidadeFederativa ufPE = ufBC.getId(3L);
		assertEquals("PERNAMBUCO", ufPE.getNome());
		
	}
	
}
