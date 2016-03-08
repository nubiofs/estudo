package lab.cadastro.business;

import javax.inject.Inject;

import br.gov.frameworkdemoiselle.lifecycle.Startup;
import br.gov.frameworkdemoiselle.transaction.Transactional;
import lab.cadastro.entity.Pessoa;
import lab.cadastro.persistence.PessoaDAO;

@Transactional
public class PessoaBC {

	@Inject
	private PessoaDAO pessoaDAO;
	
	//Recurso do Demoiselle para fazer a carga inicial na aplicação
	@Startup
	public void load(){
		
		Pessoa p = new Pessoa();
		p.setNome("nubio");
		p.setEmail("nubio@gmail.com");
		p.setTelefone("(81) 2126-4249");
		
		pessoaDAO.insert(p);

		p = new Pessoa();
		p.setNome("batman");
		p.setEmail("batman@gmail.com");
		p.setTelefone("(81) 1234-5678");
		
		pessoaDAO.insert(p);
		
		p = new Pessoa();
		p.setNome("ela");
		p.setEmail("ela@gmail.com");
		p.setTelefone("(81) 5678-3333");
		
		pessoaDAO.insert(p);

	}
	
}
