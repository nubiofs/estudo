package tutorial.view;

import javax.inject.Inject;

import org.ol4jsf.component.api.FeatureVector;
import org.ol4jsf.util.WKTFeaturesCollection;

import br.gov.frameworkdemoiselle.annotation.PreviousView;
import br.gov.frameworkdemoiselle.lifecycle.Startup;
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
		return null;
	}

	@Override
	@Transactional
	public String insert() {
		return null;
	}

	@Override
	@Transactional
	public String update() {
		return null;
	}

	@Override
	protected UnidadeFederativa handleLoad(Long id) {
		return this.ufBC.load(id);
	}

	private UnidadeFederativa ufPE;
	private String descricaoPE="";
	private String poligonoTextPE="";
	private String wktPE="";
	
	@Startup
	@Transactional
	public void loadUfPE() {
		
		this.ufPE = this.handleLoad(3L);
		this.poligonoTextPE = this.ufPE.getPoligono().toText();
		
		WKTFeaturesCollection features = new WKTFeaturesCollection();
		features.addFeature(new FeatureVector(this.poligonoTextPE));
		String[] geo = features.toMap().split("'");
		System.out.println("VER wktPE: " + geo[1]);
		this.setWktPE(geo[1]);
		
	}
	
	public String getDescricaoPE() {
		return descricaoPE;
	}
	
	public void setDescricaoPE(String descricaoPE) {
		this.descricaoPE = descricaoPE;
	}
	
	@Transactional
	public String descricaoPE(){
		this.descricaoPE = " Nome de PE: [" + this.ufPE.getNome() + "]; Geo = [" + this.poligonoTextPE + "]";
		System.out.println("VER descricaoPE: " + this.descricaoPE);
		return this.descricaoPE;
	}

	@Transactional
	public String getWktPE(){
        return this.wktPE;
	}
	
	public void setWktPE(String wkt) {
		this.wktPE = wkt;
	}
	
}
