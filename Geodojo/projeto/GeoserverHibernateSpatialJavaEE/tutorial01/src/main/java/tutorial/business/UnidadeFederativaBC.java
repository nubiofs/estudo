package tutorial.business;

import br.gov.frameworkdemoiselle.stereotype.BusinessController;
import br.gov.frameworkdemoiselle.template.DelegateCrud;
import br.gov.frameworkdemoiselle.transaction.Transactional;
import tutorial.domain.UnidadeFederativa;
import tutorial.persistence.UnidadeFederativaDAO;

@BusinessController
public class UnidadeFederativaBC extends DelegateCrud<UnidadeFederativa, Long, UnidadeFederativaDAO> {
	
	private static final long serialVersionUID = 1L;
	
	//@Startup
	@Transactional
	public void load() {
		
		UnidadeFederativa uf = load(3L);
		System.out.println("Em (UnidadeFederativaBC -> load): "+uf.getNome());
		
	}
	
	@Transactional
	public UnidadeFederativa getId(Long id) {
		return load(id);
	}
	
}
