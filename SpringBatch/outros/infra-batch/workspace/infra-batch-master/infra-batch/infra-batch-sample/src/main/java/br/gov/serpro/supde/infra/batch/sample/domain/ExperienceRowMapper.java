package br.gov.serpro.supde.infra.batch.sample.domain;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.springframework.jdbc.core.RowMapper;

public class ExperienceRowMapper implements RowMapper<Experience> {

	public static final String ID_COLUMN = "id";
    public static final String NOME_COLUMN = "name";
    public static final String PAIS_COLUMN = "country";
    public static final String DATA_NASCIMENTO_COLUMN = "birthdate";
    public static final String EMPRESA_COLUMN = "company";
    public static final String DEPARTAMENTO_COLUMN = "depto";
    //public static final String EXTRA_COLUMN = "extra";
	
	public Experience mapRow(ResultSet rs, int rowNum) throws SQLException {
		Experience bean = new Experience();
		
		bean.setId(rs.getLong(ID_COLUMN));
		bean.setNome(rs.getString(NOME_COLUMN));
		bean.setPais(rs.getString(PAIS_COLUMN));
		
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		try {
			bean.setDataNascimento(sdf.parse(rs.getString(DATA_NASCIMENTO_COLUMN)));
		} catch(ParseException e) {
			throw new RuntimeException(e);
		}
				
		bean.setEmpresa(rs.getString(EMPRESA_COLUMN));
		bean.setDepartamento(rs.getString(DEPARTAMENTO_COLUMN));
		//bean.setExtra(rs.getString(EXTRA_COLUMN));
				
		return bean;
	}

}
