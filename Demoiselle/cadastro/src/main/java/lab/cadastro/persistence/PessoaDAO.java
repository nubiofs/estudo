package lab.cadastro.persistence;

import java.lang.reflect.Field;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import br.gov.frameworkdemoiselle.annotation.Name;
import br.gov.frameworkdemoiselle.transaction.Transactional;
import br.gov.frameworkdemoiselle.util.Beans;
import br.gov.frameworkdemoiselle.util.Reflections;
import br.gov.frameworkdemoiselle.util.Strings;
import lab.cadastro.entity.Pessoa;

@Transactional
public class PessoaDAO {

	@Inject
	@Name("cadastro-ds")
	private EntityManager em;

	// Esse método estático "getInstance", retorna uma instância controlada
	// pelo CDI da classe PessoaDAO
	public static PessoaDAO getInstance() {
		return Beans.getReference(PessoaDAO.class);
	}

	public void insert(Pessoa pessoa) {
		em.persist(pessoa);
	}

	public Pessoa load(Integer id) {
		return em.find(Pessoa.class, id);
	}

	public void update(Pessoa pessoa) {
		em.merge(pessoa);
	}
	
	/*
	public List<Pessoa> find() {
        StringBuffer jpql = new StringBuffer();
        jpql.append(" select p ");
        jpql.append("   from Pessoa p ");
        jpql.append("  order by ");
        jpql.append("        p.nome asc ");
 
        TypedQuery<Pessoa> query = em.createQuery(jpql.toString(), Pessoa.class);
 
        return query.getResultList();
        
    }
    */

	/*
	 * Obs.: O resultado da consulta:
	 *  
	 * "SELECT * FROM PESSOA p where p.NOME LIKE '%%' or p.EMAIL like '%%' or p.TELEFONE like '%%' order by p.NOME asc"
	 * 
	 * é igual a consulta:
	 * 
	 * "SELECT * FROM PESSOA p order by p.NOME asc"
	 * 
	 */
	public List<Pessoa> find(String filter) {
	    StringBuffer jpql = new StringBuffer();
	    jpql.append(" select p ");
	    jpql.append("   from Pessoa p ");
	    jpql.append("  where lower(p.nome) like :filter ");
	    jpql.append("     or lower(p.email) like :filter ");
	    jpql.append("     or p.telefone like :filter ");
	    jpql.append("  order by ");
	    jpql.append("        p.nome asc ");
	 
	    TypedQuery<Pessoa> query = em.createQuery(jpql.toString(), Pessoa.class);
	    query.setParameter("filter", "%" + (filter == null ? "" : filter.toLowerCase()) + "%");//igual '%%' quando filter é nulo
	 
	    return query.getResultList();
	}
	
	//A cláusula order by só será considerada na query caso o parâmetro order 
	//não esteja vazio.
	public List<Pessoa> find(String filter, String order) {
	    StringBuffer jpql = new StringBuffer();
	    jpql.append(" select p ");
	    jpql.append("   from Pessoa p ");
	    jpql.append("  where lower(p.nome) like :filter ");
	    jpql.append("     or lower(p.email) like :filter ");
	    jpql.append("     or p.telefone like :filter ");
	 
	    if (!Strings.isEmpty(order)) {
	        validate(order);
	        jpql.append("  order by ");
	        jpql.append("        " + order + "  asc ");
	    }
	 
	    TypedQuery<Pessoa> query = em.createQuery(jpql.toString(), Pessoa.class);
	    query.setParameter("filter", "%" + (filter == null ? "" : filter.toLowerCase()) + "%");
	 
	    return query.getResultList();
	}
	 
	//Para evitar a vulnerabilidade conhecida como SQL Injection. O utilitário Reflections 
	//do Demoiselle verifica se o valor do parâmetro "order" corresponde a algum dos atributos 
	//do Pojo Pessoa.
	private void validate(String order) {
	    for (Field field : Reflections.getNonStaticDeclaredFields(Pessoa.class)) {
	        if (field.getName().equalsIgnoreCase(order)) {
	            return;
	        }
	    }
	 
	    throw new IllegalArgumentException();
	}
	
	public void remover(Integer id) {
		em.remove(this.load(id));
	}
	
}
