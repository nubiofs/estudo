package br.home.testeGeoserverManager;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.net.MalformedURLException;
import java.util.Map;

import org.junit.BeforeClass;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import it.geosolutions.geoserver.rest.GeoServerRESTReader;
import it.geosolutions.geoserver.rest.decoder.RESTLayer;
import it.geosolutions.geoserver.rest.encoder.feature.FeatureTypeAttribute;

public class GeoserverTestesIniciais {

	private static final String RESTURL = "http://localhost:8080/geoserver";
	private static final String RESTUSER = "admin";
	private static final String RESTPW = "geoserver";

	private static GeoServerRESTReader reader;

	private static final Logger LOGGER = LoggerFactory.getLogger(GeoserverTestesIniciais.class);
	
	@BeforeClass
	public static void beforeClass() {
		
		try {
			reader = new GeoServerRESTReader(RESTURL, RESTUSER, RESTPW);
		} catch (MalformedURLException e) {
			e.printStackTrace();
			LOGGER.error(e.getMessage());
		}

	}

	@Test
	public void existGeoserver() {
		assertTrue(reader.existGeoserver());
		LOGGER.info("existGeoserver OK...");
	}
	
	@Test
	public void getLayerStates() {
		String layer = "states";
		String workspace = "topp";
		RESTLayer states = reader.getLayer(workspace, layer);
		assertEquals(layer, states.getName());
		LOGGER.info("exist states Layer OK...");
//		RESTResource resource = reader.getResource(states);
//		System.out.println(resource.getAbstract());
//		System.out.println(resource.getStoreUrl());
//		System.out.println(resource.getStoreName());
//		System.out.println(reader.getFeatureTypes(workspace));
		
		//System.out.println(reader.getFeatureType(states).toString());
		
		//System.out.println(reader.getFeatureType(states).getAttributeList().toString());
		//for(Map<FeatureTypeAttribute, String> lista : reader.getFeatureType(states).getAttributeList()){
		for(int i = 0; i < reader.getFeatureType(states).getAttributeList().size(); i++){
			Map<FeatureTypeAttribute, String> ftMap = reader.getFeatureType(states).getAttributeList().get(i);
			for(int j=0; j < ftMap.size(); j++){
				if(ftMap.get(j).equals(FeatureTypeAttribute.name)){
					
				}
			}
//			if(lista.get("name").equals("the_geom")){
//				//{name=the_geom, binding=com.vividsolutions.jts.geom.MultiPolygon, nillable=true, minOccurs=0, length=null, maxOccurs=1}
//			}
			//System.out.println(lista.toString());
		}
		
	}

}
