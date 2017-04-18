package br.gov.serpro.supde.infra.batch.sample.domain;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Experience implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String nome;
	private String pais;
	private Date dataNascimento;
	private String empresa;
	private String departamento;
	//private String extra;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getPais() {
		return pais;
	}

	public void setPais(String pais) {
		this.pais = pais;
	}	
		
	public Date getDataNascimento() {
		return dataNascimento;
	}

	public void setDataNascimento(Date dataNascimento) {
		this.dataNascimento = dataNascimento;
	}
	
	public String getDataNascimentoFormatted() {
		String result = null;
		if(dataNascimento != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
			result = sdf.format(dataNascimento);
		}
		
		return result;
	}

	public String getEmpresa() {
		return empresa;
	}

	public void setEmpresa(String empresa) {
		this.empresa = empresa;
	}

	public String getDepartamento() {
		return departamento;
	}

	public void setDepartamento(String departamento) {
		this.departamento = departamento;
	}

//	public String getExtra() {
//		return extra;
//	}
//
//	public void setExtra(String extra) {
//		this.extra = extra;
//	}

}
