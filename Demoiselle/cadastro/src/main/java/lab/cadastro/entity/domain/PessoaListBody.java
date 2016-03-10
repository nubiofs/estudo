package lab.cadastro.entity.domain;

import lab.cadastro.entity.Pessoa;

//Nova classe do tipo Pessoa devido necessidade de 
//buscar também o atributo "id" de Pessoa 
public class PessoaListBody {

	private Integer id;

	private String nome;

	private String email;

	private String telefone;

	public PessoaListBody(Pessoa pessoa){
		this.id = pessoa.getId();
		this.nome = pessoa.getNome();
		this.email = pessoa.getEmail();
		this.telefone = pessoa.getTelefone();
	}
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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
