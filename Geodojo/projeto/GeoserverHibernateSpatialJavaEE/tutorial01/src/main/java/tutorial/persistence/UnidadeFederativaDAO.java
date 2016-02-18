package tutorial.persistence;

import javax.persistence.PersistenceUnit;

import br.gov.frameworkdemoiselle.stereotype.PersistenceController;
import br.gov.frameworkdemoiselle.template.JPACrud;
import tutorial.domain.UnidadeFederativa;

@PersistenceController
public class UnidadeFederativaDAO extends JPACrud<UnidadeFederativa, Long> {
	
	private static final long serialVersionUID = 1L;
	
}
