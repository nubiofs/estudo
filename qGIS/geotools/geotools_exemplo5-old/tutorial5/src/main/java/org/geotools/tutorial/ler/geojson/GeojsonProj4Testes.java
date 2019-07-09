package org.geotools.tutorial.ler.geojson;

import java.awt.Color;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.geotools.data.DataUtilities;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.SchemaException;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.map.FeatureLayer;
import org.geotools.map.Layer;
import org.geotools.map.MapContent;
import org.geotools.styling.SLD;
import org.geotools.styling.Style;
import org.geotools.swing.JMapFrame;
import org.locationtech.jts.geom.Geometry;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

public class GeojsonProj4Testes {
	
	private static SimpleFeatureType TYPE_POLYGON = null;

	static {

		try {
			TYPE_POLYGON = DataUtilities.createType(
					"Location",//featureName
					"geom:Polygon");

		} catch (SchemaException e) {
			System.out.println(e.getMessage());
			System.exit(-1);
		}

	}
	
	//(IMPORTANTE):
	//qGIS (EPSG:4326 - WGS 84 - Geographic - Unit degrees) para 
	//geojson ("crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }) 
	private static SimpleFeatureCollection geoJsonToFeatureCollection(String geojson, Geometry limite_municipal) throws Exception {

		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE_POLYGON);
		List<SimpleFeature> featuresList = new ArrayList<SimpleFeature>();

		String content = new String(Files.readAllBytes(Paths.get(geojson)), "UTF-8");

		GeoJsonReader reader = new GeoJsonReader();
		Geometry geo = reader.readGeometry(content);
		
		if(geo.isValid()) {

			featureBuilder.add(geo);
			featuresList.add(featureBuilder.buildFeature(null));

		} else {
			System.out.println("[Error] A geometria não é válida!");
		}

		return new ListFeatureCollection(TYPE_POLYGON, featuresList);

	}

	private static Layer criarLayer(SimpleFeatureCollection collection, Style style) throws Exception {
		return new FeatureLayer(collection, style);
	}
	
	public static void main(String[] args) throws Exception {
		
		// Create a map content and add our shapefile to it
		MapContent map = new MapContent();
		map.setTitle("Quickstart");

		//
		// Tratamento FeatureCollection (limite_municipal)
		//
		//String limite_municipal_geojson = "bh_limite_municipal_crs_4326_ok.geojson";//OK !!!
		String limite_municipal_geojson = "bh_limite_municipal.geojson";//OK !!!
		SimpleFeatureCollection collection = geoJsonToFeatureCollection(limite_municipal_geojson, null);
		Geometry bh_limite_municipal = (Geometry) collection.features().next().getDefaultGeometry();
		Color strokeColor = new Color(144, 200, 120);
		Color fillColor = Color.RED;
		map.addLayer(criarLayer(collection, SLD.createPolygonStyle(strokeColor, fillColor, 1.0f)));

		// Now display the map
		JMapFrame.showMap(map);
		
	}

}
