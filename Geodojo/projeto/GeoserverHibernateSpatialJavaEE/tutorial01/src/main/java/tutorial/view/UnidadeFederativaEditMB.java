package tutorial.view;

import javax.inject.Inject;

import br.gov.frameworkdemoiselle.annotation.PreviousView;
import br.gov.frameworkdemoiselle.stereotype.ViewController;
import br.gov.frameworkdemoiselle.template.AbstractEditPageBean;
import br.gov.frameworkdemoiselle.transaction.Transactional;
import tutorial.business.UnidadeFederativaBC;
import tutorial.domain.UnidadeFederativa;

@ViewController
@PreviousView("/bookmark_list.xhtml")
public class UnidadeFederativaEditMB extends AbstractEditPageBean<UnidadeFederativa, Long> {

	private static final long serialVersionUID = 1L;

	@Inject
	private UnidadeFederativaBC ufBC;

	@Override
	@Transactional
	public String delete() {
//		this.bookmarkBC.delete(getId());
//		return getPreviousView();
		return null;
	}

	@Override
	@Transactional
	public String insert() {
//		this.bookmarkBC.insert(getBean());
//		return getPreviousView();
		return null;
	}

	@Override
	@Transactional
	public String update() {
//		this.bookmarkBC.update(getBean());
//		return getPreviousView();
		return null;
	}

	@Override
	protected UnidadeFederativa handleLoad(Long id) {
		return this.ufBC.load(id);
	}
	
	private String mostrarPE="";
	
	public String getMostrarPE() {
		return this.mostrarPE;
	}

	public void setMostrarPE(String mostrarPE) {
		this.mostrarPE = mostrarPE;
	}
	
	@Transactional
	public String mostrarPE(){
		UnidadeFederativa uf = this.ufBC.getId(3L);
		this.mostrarPE = " Nome de PE: [" + uf.getNome() + "]; Geo = [" + uf.getPoligono().toText() + "]";
		//System.out.println(this.mostrarPE);
		return this.mostrarPE;
	}

}
