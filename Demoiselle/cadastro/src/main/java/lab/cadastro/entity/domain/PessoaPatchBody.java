package lab.cadastro.entity.domain;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;

import lab.cadastro.entity.Pessoa;

public class PessoaPatchBody {

	@Size(min = 3, max = 50)
	private String nome;

	@Email
	@Size(max = 255)
	private String email;

	@Size(max = 15)
	private String telefone;

	public PessoaPatchBody(){
		
	}
	
	public PessoaPatchBody(Pessoa pessoa) {
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
