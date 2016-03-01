package lab.cadastro.persistence;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import br.gov.frameworkdemoiselle.annotation.Name;
import br.gov.frameworkdemoiselle.transaction.Transactional;
import br.gov.frameworkdemoiselle.util.Beans;
import lab.cadastro.entity.Pessoa;

@Transactional
public class PessoaDAO {

	@Inject
	@Name("cadastro-ds")
	private EntityManager em;
	
	//Esse método estático "getInstance", retorna uma instância controlada 
	//pelo CDI da classe PessoaDAO
	public static PessoaDAO getInstance() {
        return Beans.getReference(PessoaDAO.class);
    }
	
	public void insert(Pessoa pessoa) {
        em.persist(pessoa);
    }
	
	public Pessoa load(Integer id) {
        return em.find(Pessoa.class, id);
    }
	
}
