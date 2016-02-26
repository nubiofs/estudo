package br.home.testeGeoserverManager;

import java.net.MalformedURLException;
import static org.junit.Assert.*;
import org.junit.BeforeClass;
import org.junit.Test;

import it.geosolutions.geoserver.rest.GeoServerRESTReader;

public class acessoGeoserverTest {

	private static final String RESTURL = "http://localhost:8080/geoserver";
	private static final String RESTUSER = "admin";
	private static final String RESTPW = "geoserver";
	
	@BeforeClass
	public static void beforeClass() {
		
	}

	@Test
	public void acessoOK() {

		GeoServerRESTReader reader;
		
		try {
			reader = new GeoServerRESTReader(RESTURL, RESTUSER, RESTPW);
			assertTrue(reader.existGeoserver());
		} catch (MalformedURLException e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}

	}

}
