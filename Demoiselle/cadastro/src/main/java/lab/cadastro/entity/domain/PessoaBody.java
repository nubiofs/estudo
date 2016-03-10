package lab.cadastro.entity.domain;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import lab.cadastro.entity.Pessoa;

//Obs.:  É realmente necessário manter as duas classes PessoaBody e Pessoa 
//já que elas são praticamente idênticas? Obrigatório não é, mas é interessante 
//separar sim. Em aplicações reais e mais complexas é comum que a entidade possua 
//muitos outros atributos que não interessam àquele serviço, mas a outro sim. 
//Do mesmo modo, os payloads podem possuir atributos, listas ou referenciar outras 
//classes que só fazem sentido no contexto dos serviços. Esta é apenas uma sugestão. 
public class PessoaBody {

	@NotEmpty
	@Size(min = 3, max = 50)
	private String nome;

	@Email
	@NotEmpty
	@Size(max = 255)
	private String email;

	@Size(max = 15)
	private String telefone;

	public PessoaBody(){
		
	}
	
	public PessoaBody(Pessoa pessoa){
		super();
		this.nome = pessoa.getNome();
		this.email = pessoa.getEmail();
		this.telefone = pessoa.getTelefone();
	}
	
	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

}
