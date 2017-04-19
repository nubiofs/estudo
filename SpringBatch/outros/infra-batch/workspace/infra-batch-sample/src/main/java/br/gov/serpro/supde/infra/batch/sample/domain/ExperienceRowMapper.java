package br.gov.serpro.supde.infra.batch.sample.domain;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.springframework.jdbc.core.RowMapper;

public class ExperienceRowMapper implements RowMapper<Experience> {

	public static final String ID_COLUMN = "id";
    public static final String NAME_COLUMN = "name";
    public static final String COUNTRY_COLUMN = "country";
    public static final String BIRTHDATE_COLUMN = "birthdate";
    public static final String COMPANY_COLUMN = "company";
    public static final String DEPTO_COLUMN = "depto";
	
	public Experience mapRow(ResultSet rs, int rowNum) throws SQLException {
		
		Experience bean = new Experience();
		
		bean.setId(rs.getLong(ID_COLUMN));
		bean.setName(rs.getString(NAME_COLUMN));
		bean.setCountry(rs.getString(COUNTRY_COLUMN));
		
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		try {
			bean.setBirthdate(sdf.parse(rs.getString(BIRTHDATE_COLUMN)));
		} catch(ParseException e) {
			throw new RuntimeException(e);
		}
				
		bean.setCompany(rs.getString(COMPANY_COLUMN));
		bean.setDepto(rs.getString(DEPTO_COLUMN));
				
		return bean;
		
	}

}
