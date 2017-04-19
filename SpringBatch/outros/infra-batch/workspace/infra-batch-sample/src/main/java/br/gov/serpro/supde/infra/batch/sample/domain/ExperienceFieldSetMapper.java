package br.gov.serpro.supde.infra.batch.sample.domain;

import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;
import org.springframework.validation.BindException;

public class ExperienceFieldSetMapper implements FieldSetMapper<Experience> {
	
	//id, name, country, birthdate, company, depto
	private static final int ID_INDEX = 0;
	private static final int NAME_INDEX = 1;
	private static final int COUNTRY_INDEX = 2;
	private static final int BIRTHDATE_INDEX = 3;
	private static final int COMPANY_INDEX = 4;
	private static final int DEPTO_INDEX = 5;	

	public Experience mapFieldSet(FieldSet fieldSet) throws BindException {
		
		Experience bean = null;
		if(fieldSet != null) {
			
			bean = new Experience();
			bean.setId(fieldSet.readLong(ID_INDEX));
			bean.setName(fieldSet.readString(NAME_INDEX));
			bean.setCompany(fieldSet.readString(COUNTRY_INDEX));
			bean.setBirthdate(fieldSet.readDate(BIRTHDATE_INDEX, "dd/MM/yyyy"));
			bean.setCompany(fieldSet.readString(COMPANY_INDEX));
			bean.setDepto(fieldSet.readString(DEPTO_INDEX));	
			
		}
		
		return bean;
		
	}

}
