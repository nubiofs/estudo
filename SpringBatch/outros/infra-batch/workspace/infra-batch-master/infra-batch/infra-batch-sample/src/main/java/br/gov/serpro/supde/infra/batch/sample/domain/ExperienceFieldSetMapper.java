package br.gov.serpro.supde.infra.batch.sample.domain;

import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;
import org.springframework.validation.BindException;

public class ExperienceFieldSetMapper implements FieldSetMapper<Experience> {
	
	//id, name, country, birthdate, company, depto, extra
	private static final int ID_INDEX = 0;
	private static final int NOME_INDEX = 1;
	private static final int PAIS_INDEX = 2;
	private static final int DATA_NASCIMENTO_INDEX = 3;
	private static final int EMPRESA_INDEX = 4;
	private static final int DEPARTAMENTO_INDEX = 5;	

	public Experience mapFieldSet(FieldSet fieldSet) throws BindException {
		Experience bean = null;
		if(fieldSet != null) {
			bean = new Experience();
			bean.setId(fieldSet.readLong(ID_INDEX));
			bean.setNome(fieldSet.readString(NOME_INDEX));
			bean.setPais(fieldSet.readString(PAIS_INDEX));
			bean.setDataNascimento(fieldSet.readDate(DATA_NASCIMENTO_INDEX, "dd/MM/yyyy"));
			bean.setEmpresa(fieldSet.readString(EMPRESA_INDEX));
			bean.setDepartamento(fieldSet.readString(DEPARTAMENTO_INDEX));			
		}
		
		return bean;
	}

}
