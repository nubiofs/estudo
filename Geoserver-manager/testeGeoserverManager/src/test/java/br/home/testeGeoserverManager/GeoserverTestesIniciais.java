package br.home.testeGeoserverManager;

import static org.junit.Assert.*;

import java.net.MalformedURLException;

import org.junit.BeforeClass;
import org.junit.Test;

import it.geosolutions.geoserver.rest.GeoServerRESTReader;
import it.geosolutions.geoserver.rest.decoder.RESTLayer;

public class GeoserverTestesIniciais {

	private static final String RESTURL = "http://localhost:8080/geoserver";
	private static final String RESTUSER = "admin";
	private static final String RESTPW = "geoserver";

	private static GeoServerRESTReader reader;

	@BeforeClass
	public static void beforeClass() {
		
		try {
			reader = new GeoServerRESTReader(RESTURL, RESTUSER, RESTPW);
		} catch (MalformedURLException e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}

	}

	@Test
	public void existGeoserver() {
		assertTrue(reader.existGeoserver());
	}
	
	@Test
	public void getLayerStates() {
		String layer = "states";
		RESTLayer states = reader.getLayer("topp", layer);
		assertEquals(layer, states.getName());
	}

}
